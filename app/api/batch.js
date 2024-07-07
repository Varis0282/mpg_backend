import BatchCtrl from '../controller/batch.js';

export default (app) => {
    app.post('/batch/add', async (req, res) => {
        const { body } = req;
        let resp = await BatchCtrl.add(body);
        res.json(resp);
    })
    app.get('/batch/course/:courseId', async (req, res) => {
        const { params } = req;
        let resp = await BatchCtrl.getCourseBatch(params);
        res.json(resp);
    });
    app.get('/batch/list', async (req, res) => {
        const { query } = req;
        let resp = await BatchCtrl.list(query);
        res.json(resp);
    });
    app.delete('/batch/delete', async (req, res) => {
        const { body } = req;
        let resp = await BatchCtrl.delete(body);
        res.json(resp);
    });
    app.put('/batch/update', async (req, res) => {
        const { body } = req;
        let resp = await BatchCtrl.update(body);
        res.json(resp);
    });
    app.get('/batch/:_id', async (req, res) => {
        const { params } = req;
        let resp = await BatchCtrl.findById(params);
        res.json(resp);
    });
    app.get('/batch', async (req, res) => {
        const { body, user } = req;
        body.userId = user._id;
        let resp = await BatchCtrl.getUserBatch(body);
        res.json(resp);
    });
}