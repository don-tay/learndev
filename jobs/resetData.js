const { CronJob } = require('cron');
const { deleteData, importData } = require('../seeder');

const resetDataJob = new CronJob('0 0 0 */1 * *', async () => {
    console.log('Running reset data job'.bgYellow.grey.inverse.bold);
    await deleteData();
    await importData();
    console.log(`Reset data job completed`.bgGreen.grey.inverse.bold);
});

module.exports = resetDataJob;
