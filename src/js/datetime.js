var Datetime = {
    arrayToDate: (array) => {
        return new Date(array[0], array[1] - 1, array[2], array[3], array[4], array[5]);
    },
    formatDate: (date)=> {
        let dayNames = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];

        return dayNames[date.getDay()] + ' ' + date.getDate() + '.' + (date.getMonth() + 1) + '. ' + date.getFullYear();
    },

    formatTime: (date) => {
        return ('0' + date.getHours()).slice(-2) + '.' + ('0' + date.getMinutes()).slice(-2);
    }
};