const router = require("express").Router();

const ash = require("ash");
const { authenticate } = require("~/middleware/authentication");

const User = require("@auth/models/user.model");
const Calendar = require("./models/calendar.model");
const Reminder = require("./models/reminder.model");
const Config = require("./models/config.model");

const { NotFound, BadRequest } = require("httperror");
const { CommandStartedEvent } = require("node_modules/mongodb/mongodb");

//router.use(authenticate());
// ====================== User ======================
router
  .route("/")
  .get(ash(async (req, res) => res.json({ user: req.user })))
  .put(
    ash(async (req, res) => {
      const { username, password, name } = req.body;
      const user = await User.findByIdAndUpdate(req.user, {
        username,
        password,
        name,
      });
      return res.json({
        message: "User successfully updated",
        user: user.filter(),
      });
    }),
  )
  .delete(
    ash(async (req, res) => {
      await User.findByIdAndDelete(req.user);
      return res.json({ message: "User successfully deleted" });
    }),
  );

// =================== Entities ====================
const select = "_id title description sync";
const entities = {
  reminders: {
    Model: Reminder,
    queryParams: ["completed"],
    select: select + "completed date addToCalendar",
  },
  calendars: {
    Model: Calendar,
    queryParams: ["date", "category"],
    select: select + "date category",
  },
  config: { Model: Config },
};

const getEntity = (req, next) => {
  const { Model, queryParams, select } = entities[req.params.entity];
  const query = queryParams?.reduce((a, el) => ({
    ...a,
    [el]: req.query[el],
  }));
  return { Model, query, select };
};

router
  .route("/:entity")
  .get(
    ash(async (req, res, next) => {
      const { Model, query, select } = getEntity(req, next);
      const { page, limit, ...rest } = query || {};
      const output = await Model.paginate(
        { user: req.user, ...rest },
        { select, page, limit, lean: true },
      );
      return res.json({ [req.params.entity]: output });
    }),
  )
  .post(async (req, res, next) => {
    const { Model, query, select } = getEntity(req, next);
    const { page, limit } = query || {};
    await Model.create(req.body);
    const output = Model.paginate({ user: req.user }, { select, page, limit, lean: true });
    return res.json({ [req.params.entity]: output });
  });

module.exports = router;
