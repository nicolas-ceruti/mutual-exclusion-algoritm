const randomInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) * 1000;

export default class Process {
    constructor(id, state, broadcastCallback, getCoordinatorCallback) {
        this.id = id;
        this.status = 'Ocioso';
        this.broadcastState = broadcastCallback;
        this.getCoordinator = getCoordinatorCallback;

        this.scheduleNextAttempt();
    }
    
    updateStatus(newStatus) {
        this.status = newStatus;
        this.broadcastState();
    }

    requestAccess() {
        const coordinatorInstance = this.getCoordinator();
        if (!coordinatorInstance) {
            console.log(`[PROCESSO ${this.id}] Falha na requisição: Coordenador offline.`);
            this.scheduleNextAttempt();
            return;
        }
        this.updateStatus('Requisitando');
        coordinatorInstance.handleRequest(this);
    }

    async enterCriticalSection(addLogCallback) {
        this.updateStatus('Na Seção Crítica');
        const processingTime = randomInterval(5, 15); // R03
        addLogCallback(`[PROCESSO ${this.id}] Acesso concedido! Usando recurso por ${processingTime / 1000}s.`);
        await new Promise(resolve => setTimeout(resolve, processingTime));

        this.leaveCriticalSection();
    }

    leaveCriticalSection() {
        this.updateStatus('Ocioso');
        const coordinatorInstance = this.getCoordinator();
        if (coordinatorInstance) {
           coordinatorInstance.handleRelease(this);
        }
        this.scheduleNextAttempt();
    }
    
    scheduleNextAttempt() {
        const attemptInterval = randomInterval(10, 25); //R04
        setTimeout(() => this.requestAccess(), attemptInterval);
    }
}