export default class Coordinator {
    constructor(id, state, addLogCallback, grantAccessCallback) {
        this.id                   = id;
        this.simulationState      = state;
        this.addLog               = addLogCallback;
        this.grantAccessCallback  = grantAccessCallback;

        this.simulationState.coordinator = this.id;
        this.addLog(`[SYSTEM] Coordenador ${this.id} assumiu.`);
    }

    handleRequest(process) {
        this.addLog(`[COORDENADOR ${this.id}] Recebeu REQUEST de ${process.id}`);
        if (!this.simulationState.resource.isBusy) {
            this.grantAccessCallback(process);
        } else {
            this.addLog(`[COORDENADOR ${this.id}] Recurso ocupado. ${process.id} na fila.`);
            this.simulationState.queue.push(process.id);
            process.updateStatus('Na Fila');
        }
    }

    handleRelease(process) {
        this.addLog(`[COORDENADOR ${this.id}] Recebeu RELEASE de ${process.id}.`);
        this.simulationState.resource.isBusy = false;
        this.simulationState.resource.usedBy = null;

        if (this.simulationState.queue.length > 0) {
            const nextProcessId = this.simulationState.queue.shift();
            const nextProcess = this.simulationState.processes.find(p => p.id === nextProcessId);
            if (nextProcess) {
                this.addLog(`[COORDENADOR ${this.id}] Concedendo acesso para ${nextProcess.id}.`);
                this.grantAccessCallback(nextProcess);
            }
        }
    }
}