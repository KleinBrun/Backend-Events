const { Router } = require("express");
const { check } = require("express-validator");
const { isValidDate } = require("../helpers/db-validators");

// const { validateFields, validateJWT, allowedRol } = require('../middlewares');
const { logsGet, logsPost, logPost } = require("../controllers/logs.controllers");
const { validateFields } = require("../middlewares/validate-fields");

const router = Router();

router.get('/', logsGet);

router.post('/', [
    check('*.event_type', 'El campo event_type no es valido').not().isEmpty(),
    check('*.event_type', 'El campo event_type debe ser API').isIn(['API']),
    check('*.description', 'El campo description no es valido').not().isEmpty(),
    check('*.event_date').custom(isValidDate),
    validateFields
], logsPost);

router.post('/log', [
    check('event_type', 'El campo event_type no es valido').not().isEmpty(),
    check('event_type', 'El campo event_type debe ser FORMULARIO').isIn(['FORMULARIO']),
    check('description', 'El campo description no es valido').not().isEmpty(),
    check('event_date').custom(isValidDate),
    validateFields
], logPost);

module.exports = router;