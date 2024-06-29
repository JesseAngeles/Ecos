document.addEventListener('DOMContentLoaded', function () {
    const npcList = document.getElementById('npc-list');
    const conversation = document.getElementById('conversation');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message');
    const addNpcButton = document.getElementById('add-npc');
    const deleteNpcButton = document.getElementById('delete-npc');

    // Obtener NPCs al cargar la página
    fetch('http://localhost:8085/npc/all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener NPCs');
            }
            return response.json();
        })
        .then(data => {
            // Mostrar NPCs en la lista
            data.forEach(npc => {
                const npcItem = document.createElement('li');
                npcItem.classList.add('npc-item');
                npcItem.textContent = npc.name;
                npcItem.id = npc._id;
                npcList.appendChild(npcItem);
            });
        })
        .catch(error => {
            console.error('Error al obtener NPCs:', error);
        });

    // Evento al hacer clic en un NPC de la lista
    npcList.addEventListener('click', function (event) {
        // Verificar si se hizo clic en un elemento <li> dentro de npcList
        if (event.target.tagName === 'LI') {
            const npcId = event.target.id; // Obtener el ID del NPC sin el prefijo 'npc-'

            // Obtener el flujo de mensajes del NPC seleccionado
            fetch(`http://localhost:8085/npc/${npcId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al obtener el flujo de mensajes del NPC');
                    }
                    return response.json();
                })
                .then(data => {
                    // Limpiar el contenido anterior de la conversación
                    conversation.innerHTML = '';

                    // Mostrar los mensajes del flujo
                    data.flow.forEach(message => {
                        const messageElement = document.createElement('div');
                        if (message['0'] === true) {
                            messageElement.classList.add('message', 'incoming');
                        } else {
                            messageElement.classList.add('message', 'outgoing');
                        }
                        messageElement.textContent = message['1'];
                        conversation.appendChild(messageElement);
                    });
                })
                .catch(error => {
                    console.error('Error al obtener el flujo de mensajes del NPC:', error);
                });

            // Asignar evento al formulario de mensajes para enviar un nuevo mensaje
            messageForm.addEventListener('submit', function (event) {
                event.preventDefault(); // Evitar que se envíe el formulario por defecto

                const messageText = messageInput.value.trim(); // Obtener el mensaje del campo de entrada
                if (messageText !== '') {
                    const url = `http://localhost:8085/npc/${npcId}`; // URL para enviar el mensaje al NPC

                    // Objeto JSON con el mensaje a enviar
                    const messageData = {
                        message: messageText
                    };

                    const messageElement = document.createElement('div');
                    var messageReceived;

                    messageElement.classList.add('message', 'outgoing');
                    messageElement.textContent = messageText;
                    conversation.appendChild(messageElement);

                    // Enviar el mensaje al servidor usando fetch con método POST
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(messageData)
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Error al enviar el mensaje al NPC');
                            }
                            return response.json();
                        })
                        .then(data => {
                            const messageElement2 = document.createElement('div');
                            const messageReceived = data.flow[data.flow.length - 1][1];
                            messageElement2.classList.add('message', 'incoming');
                            messageElement2.textContent = messageReceived;
                            conversation.appendChild(messageElement2);
                        })
                        .catch(error => {
                            console.error('Error al enviar el mensaje al NPC:', error);
                            // Manejar el error, por ejemplo mostrando un mensaje al usuario
                        });

                    console.log(messageReceived);


                    messageInput.value = '';
                }
            });
        }
    });

    // Evento para agregar un NPC
    addNpcButton.addEventListener('click', function () {
        const name = prompt('Nombre:');
        const mood = 1;
        const context = prompt('Contexto:');
        const firstMessage = prompt('Primer mensaje:');

        if (name && context && firstMessage) {
            const npcData = {
                name: name,
                mood: mood,
                context: context,
                firstMessage: firstMessage
            };

            const addUrl = 'http://localhost:8085/npc/add';

            fetch(addUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(npcData)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al crear NPC');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('NPC creado:', data);
                    const npcItem = document.createElement('li');
                    npcItem.classList.add('npc-item');
                    npcItem.textContent = name;
                    npcList.appendChild(npcItem);
                })
                .catch(error => {
                    console.error('Error al crear NPC:', error);
                });
        }
    });

});
