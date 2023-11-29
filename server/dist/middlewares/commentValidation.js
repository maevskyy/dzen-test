"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentValidation = void 0;
class CommnetValidation {
    constructor() {
        this.limitOfTXT = 100 * 1024;
        this.requiredFields = ['userName', 'email', 'text'];
    }
    validate(req, res, next) {
        try {
            const files = req.files;
            const attachedFile = files.file[0];
            const userData = JSON.parse(req.body.userData);
            //?improve it
            //this is limit for txt files, but i think i could do it in multer
            if (attachedFile.mimetype === 'text/plain') {
                if (attachedFile.size > this.limitOfTXT) {
                    return res.status(400).json({ ok: false, message: 'File limit reached' });
                }
            }
            //if body is wrong
            for (const field of this.requiredFields) {
                if (!(field in userData)) {
                    return res.status(400).json({ ok: false, message: `Missing required field: ${this.requiredFields}` });
                }
            }
            next();
        }
        catch (error) {
            //?why i cannot hanlde error in normal way 
            //errror about empty body just here, idk, its just 
            res.status(400).json({ ok: false, message: 'Body is required' });
        }
    }
}
const validationInstance = new CommnetValidation();
exports.commentValidation = validationInstance.validate.bind(validationInstance);
