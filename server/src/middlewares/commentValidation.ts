    import { Request, Response, NextFunction } from 'express'

export interface MulterFiles {
    [fieldname: string]: Express.Multer.File[];
}

class CommnetValidation {
    private limitOfTXT: number = 100 * 1024
    private requiredFields: string[] = ['userName', 'email', 'text']

    public validate (req: Request, res: Response, next: NextFunction) {
        try {
            const files = req.files as MulterFiles;
            const attachedFile = files.file[0];
            const userData = JSON.parse(req.body.userData);
          
            //?improve it
            //this is limit for txt files, but i think i could do it in multer
            if (attachedFile.mimetype === 'text/plain') {
                if (attachedFile.size > this.limitOfTXT) {
                    return res.status(400).json({ ok: false, message: 'File limit reached' })
                }
            }
            //if body is wrong
            for (const field of this.requiredFields) {
                if (!(field in userData)) {
                    return res.status(400).json({ ok: false, message: `Missing required field: ${this.requiredFields}` });
                }
            }
    
            next()
        } catch (error) {
            //?why i cannot hanlde error in normal way 
            //errror about empty body just here, idk, its just 
            res.status(400).json({ ok: false, message: 'Body is required' })
        }
    }

}

const validationInstance = new CommnetValidation()
export const commentValidation = validationInstance.validate.bind(validationInstance)