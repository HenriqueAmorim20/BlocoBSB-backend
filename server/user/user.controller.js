const User = require('./user.model');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.nome - The name of user.
 * @property {string} req.body.senha - The password of user.
 * @property {string} req.body.email - The email of user.
 * @returns {User}
 */
function create(req, res, next) {
  const user = new User(req.body);

  try {
    const result = user.save();
    res.status(httpStatus.CREATED).json({ user: result });
  } catch (error) {
    next(new APIError(error.message, httpStatus.NOT_FOUND));
  }
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.senha - The password of user.
 * @returns {User}
 */
function update(req, res, next) {
  const user = req.user;
  user.nome = req.body.nome;
  user.senha = req.body.senha;

  user
    .save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

async function listUsers(req, res, next) {
  let filtros = {};
  let result = {};
  let campos = [];

  const pagina = parseInt(req.query.pagina || 0, 10);
  const tamanhoPagina = Math.min(
    parseInt(req.query.tamanhoPagina || 20, 10),
    100
  );

  if (req.query.filtros) {
    try {
      filtros = JSON.parse(req.query.filtros);
    } catch (error) {
      next(
        new APIError(
          'Filtro mal formatado, esperado um json',
          httpStatus.BAD_REQUEST,
          true
        )
      );
    }
  }

  if (req.query.campos) {
    campos = req.query.campos.split(',');
  }

  try {
    result = await User.list({ pagina, tamanhoPagina, filtros, campos });
  } catch (error) {
    next(error);
  }

  res.setHeader('X-Total-Count', result.count);
  res.status(httpStatus.OK).json(result.users);
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user
    .remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

module.exports = { load, get, create, update, listUsers, remove };
