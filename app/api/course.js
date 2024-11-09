import CourseCtrl from '../controller/course.js'

export default (app) => {
    app.route('/course')
        .post(async (req, res) => {
            const { body } = req;
            const data = await CourseCtrl.add(body);
            res.send(data);
        })
        .get(async (req, res) => {
            const { query } = req;
            const data = await CourseCtrl.list(query);
            res.send(data);
        })
    app.route('/course/:_id')
        .get(async (req, res) => {
            const { params } = req;
            const data = await CourseCtrl.findById(params);
            res.send(data);
        })
        .put(async (req, res) => {
            const { body } = req;
            const data = await CourseCtrl.update(body);
            res.send(data);
        })
        .delete(async (req, res) => {
            const { params } = req;
            const data = await CourseCtrl.delete(params);
            res.send(data);
        })

    app.put('/course/update/:_id', async (req, res) => {
        const { body, params } = req;
        body.courseId = params._id;
        if (body.type === 'project') {
            const data = await CourseCtrl.addProject(body);
            res.send(data);
        }
        if (body.type === 'keyFeature') {
            const data = await CourseCtrl.addKeyFeature(body);
            res.send(data);
        }
        if (body.type === 'meta') {
            const data = await CourseCtrl.addMeta(body);
            res.send(data);
        }
        if (body.type === 'module') {
            const data = await CourseCtrl.addModule(body);
            res.send(data);
        }
        if (body.type === 'mentor') {
            const data = await CourseCtrl.addMentor(body);
            res.send(data);
        }
        if (body.type === 'skill') {
            const data = await CourseCtrl.addSkill(body);
            res.send(data);
        }
    })

    app.post('/course/review', async (req, res) => {
        const { body, user } = req;
        body.userId = user._id;
        body.userName = user.name;
        const data = await CourseCtrl.addReview(body);
        res.send(data);
    })
}