import Joi from "joi";

const setup = (method) => {
  return [
    (req, resp, next) => {
      const schema = method()
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        return resp.status(422).json({
          error: error.details.map((item) => {
            return item.message.replace(/['"]/g, "");
          }),
        });
      }
      return next();
    },
  ];
}

export default class InputValidator {
  static validate(method) {
    return setup(this[method])
  }

  static createHtml() {
    return Joi.object({
      html_content: Joi.string().required(),
      replace: Joi.array().items(Joi.object({
        value: Joi.string().required(),
        toBeReplacedWith: Joi.string().required(),
      })),
    });
  }

}
