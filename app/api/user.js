import UserCtrl from '../controller/user.js'
import add from '../../faker/add.js';


export default (app) => {
    app.post('/user/add', async (req, res) => {
        const { body } = req;
        const data = await UserCtrl.add(body);
        res.send(data);
    })
    app.get('/user/list', async (req, res) => {
        const { query } = req;
        const data = await UserCtrl.list(query);
        res.send(data);
    })
    app.get('/user/:_id', async (req, res) => {
        const { params } = req;
        const data = await UserCtrl.findById(params);
        res.send(data);
    })
    app.post('/user/login', async (req, res) => {
        const { body } = req;
        const data = await UserCtrl.login(body);
        res.send(data);
    })
}