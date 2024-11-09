import UserCtrl from '../controller/user.js'
import add from '../../faker/add.js';
import privateResource from '../middleware/privateResource.js';


export default (app) => {
    app.post('/user/add', async (req, res) => {
        const { body } = req;
        const data = await UserCtrl.add(body);
        res.send(data);
    })
    app.get('/user/list', privateResource, async (req, res) => {
        const { query } = req;
        const data = await UserCtrl.list(query);
        res.send(data);
    })
    app.get('/user/me', privateResource, async (req, res) => {
        const { user } = req;
        const data = await UserCtrl.me(user);
        res.send(data);
    })
    app.put('/user/update', privateResource, async (req, res) => {
        const { body, user } = req;
        body._id = user._id;
        const data = await UserCtrl.update(body);
        res.send(data);
    })
    app.get('/user/:_id', privateResource, async (req, res) => {
        const { params } = req;
        const data = await UserCtrl.findById(params);
        res.send(data);
    })
    app.post('/user/login', async (req, res) => {
        const { body } = req;
        const data = await UserCtrl.login(body);
        res.send(data);
    })
    app.post('/user/mailverify', async (req, res) => {
        const { body } = req
        const data = await UserCtrl.verifyOtp(body);
        res.send(data)
    })
}