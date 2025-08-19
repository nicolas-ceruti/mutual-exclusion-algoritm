import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from "socket.io";

import Coordinator from './simulation/Coordinator.js';
import Process     from './simulation/Process.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const app        = express();
const server     = http.createServer(app);
const io         = new Server(server);

const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando! Abra http://localhost:${PORT} no seu navegador.`);
    startSimulation();
});



const randomId = () => Math.floor(Math.random() * 1000);
let coordinatorInstance = null;
let simulationState = {
    coordinator: null,
    resource: { isBusy: false, usedBy: null },
    queue: [],
    processes: [],
    log: [],
};


const emitBroadcastUpdate = () => io.emit('update', simulationState);

const addLog = (message) => {
    const timestamp  = new Date().toLocaleTimeString('pt-BR');
    const logMessage = `[${timestamp}] ${message}`;
    simulationState.log.unshift(logMessage);
    // if (simulationState.log.length > 20) simulationState.log.pop();
    emitBroadcastUpdate();
};

const grantAccess = (process) => {
    simulationState.resource.isBusy = true;
    simulationState.resource.usedBy = process.id;
    addLog(`[COORDENADOR ${coordinatorInstance.id}] Enviando GRANT para ${process.id}`);
    process.enterCriticalSection(addLog); 
    emitBroadcastUpdate();
};

const getCoordinator = () => coordinatorInstance;


function createNewProcess() {
    let newId; 
    do { newId = randomId(); } while (simulationState.processes.some(p => p.id === newId)); //R06

    const newProcess = new Process(newId, simulationState, emitBroadcastUpdate, getCoordinator);
    simulationState.processes.push(newProcess);
    addLog(`[SYSTEM] Processo ${newId} foi criado.`);
    emitBroadcastUpdate();
}

function startSimulation() {
    coordinatorInstance = new Coordinator(randomId(), simulationState, addLog, grantAccess);

    for (let i = 0; i < 3; i++) {
        createNewProcess();
    }

    setInterval(() => {
        if (coordinatorInstance) {
            addLog(`---- COORDENADOR ${coordinatorInstance.id} MORREU. Fila perdida. ----`);

          
            if (simulationState.resource.isBusy) {
                const interruptedProcessId = simulationState.resource.usedBy;
                const interruptedProcess = simulationState.processes.find(p => p.id === interruptedProcessId);

                addLog(`[SYSTEM] Processo ${interruptedProcessId} foi interrompido devido à falha do coordenador.`);
                
                if (interruptedProcess) {
                    interruptedProcess.updateStatus('Ocioso');
                }
                
                simulationState.resource.isBusy = false;
                simulationState.resource.usedBy = null;
            }

            if (simulationState.queue.length > 0) {
                const lostProcesses = simulationState.queue.join(', ');
                addLog(`[SYSTEM] Requisições na fila [${lostProcesses}] foram perdidas.`);
                simulationState.queue.forEach(processId => {
                    const p = simulationState.processes.find(proc => proc.id === processId);
                    if (p) p.updateStatus('Ocioso')
                });
            }
        }

        coordinatorInstance = null;
        simulationState.coordinator = null;
        simulationState.queue = []; //R02
        emitBroadcastUpdate();

        setTimeout(() => {
            coordinatorInstance = new Coordinator(randomId(), simulationState, addLog, grantAccess);
        }, 3000);

    }, 60000); // R01


    setInterval(createNewProcess, 40000); //R05
}