const socket = io();

const coordinatorIdEl = document.getElementById('coordinator-id');
const resourceStatusEl = document.getElementById('resource-status');
const resourceStateEl = document.getElementById('resource-state');
const resourceUserEl = document.getElementById('resource-user');
const queueListEl = document.getElementById('queue-list');
const processListEl = document.getElementById('process-list');
const logBoxEl = document.getElementById('log-box');

function getStatusClass(status) {
    return 'status-' + status.toLowerCase().replace(/ /g, '-');
}

socket.on('update', (state) => {
    // Atualiza o Coordenador
    if (state.coordinator) {
        coordinatorIdEl.textContent = `ID: ${state.coordinator}`;
        coordinatorIdEl.style.color = '#bb86fc';
    } else {
        coordinatorIdEl.textContent = 'Offline';
        coordinatorIdEl.style.color = '#c62828';
    }

    // Atualiza o status do Recurso
    if (state.resource.isBusy) {
        resourceStatusEl.className = 'status-box status-busy';
        resourceStateEl.textContent = 'OCUPADO';
        resourceUserEl.textContent = `Em uso por: Processo ${state.resource.usedBy}`;
    } else {
        resourceStatusEl.className = 'status-box status-free';
        resourceStateEl.textContent = 'LIVRE';
        resourceUserEl.textContent = 'Ninguém usando';
    }

    // Atualiza a Fila de Espera
    queueListEl.innerHTML = '';
    if (state.queue.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Fila vazia';
        li.style.opacity = '0.5';
        queueListEl.appendChild(li);
    } else {
        state.queue.forEach(processId => {
            const li = document.createElement('li');
            li.textContent = `Processo ${processId}`;
            queueListEl.appendChild(li);
        });
    }

    

    // Ordena e Atualiza a Lista de Processos
    const statusOrder = {
        'Na Seção Crítica': 1,
        'Na Fila': 2,
        'Requisitando': 3,
        'Ocioso': 4
    };

    // Ordena o array de processos com base na prioridade do status
    state.processes.sort((a, b) => {
        const priorityA = statusOrder[a.status] || 99; // || 99 é um fallback
        const priorityB = statusOrder[b.status] || 99;

        if (priorityA !== priorityB) {
            return priorityA - priorityB;
        }
        // Se o status for o mesmo, ordena pelo ID para manter a consistência
        return a.id - b.id;
    });

    processListEl.innerHTML = '';
    state.processes.forEach(proc => {
        const div = document.createElement('div');
        div.className = 'process-item';
        
        const idSpan = document.createElement('span');
        idSpan.className = 'id';
        idSpan.textContent = `Processo ${proc.id}`;
        
        const statusSpan = document.createElement('span');
        statusSpan.className = `status ${getStatusClass(proc.status)}`;
        statusSpan.textContent = proc.status;
        
        div.appendChild(idSpan);
        div.appendChild(statusSpan);
        processListEl.appendChild(div);
    });
    

    // Atualiza o Log de Eventos
    logBoxEl.innerHTML = '';
    state.log.forEach(msg => {
        const p = document.createElement('p');
        p.textContent = msg;
        logBoxEl.appendChild(p);
    });
});