export class ApiError extends Error {
    status: number;
    code: string;

    constructor(message: string, status = 400, code = "BAD_REQUEST"){
        super(message);
        this.status = status;
        this.code = code;
    }
}

/*Error is a built in class with keys already such as message and stack
here we are extending onto that inbuilt class and adding things e.g status and code
because this is a subclass, we have to refer to the parent class first here we are referring to the
parents message by using the 'super' function and we are if had anything else from the parent class that we needed to use we would add it by using the super function
we added status and code, so when its passed through the class it will override the original status and code, hence what the this is used for to reference those keys and add the new info to them
if no new status or code is added it falls onto the ones we set above
*/