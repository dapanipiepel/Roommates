const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const newRoommate = async () => {
    try {
        const { data } = await axios.get(`https://randomuser.me/api`);
        const user = data.results[0];
        const roommate = {
            id: uuidv4().slice(-5),
            nombre: `${user.name.first} ${user.name.last}`,
            debe: user.debe,
            recibe: user.recibe,
        };
        return roommate;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const saveRoommate = (roommate) => {
    const roommatesJSON = JSON.parse(fs.readFileSync('assets/json/roommates.json', 'utf8'));
    roommatesJSON.roommates.push(roommate);
    fs.writeFileSync('assets/json/roommates.json', JSON.stringify(roommatesJSON));
};

module.exports = { newRoommate, saveRoommate }