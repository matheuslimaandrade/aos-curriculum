const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
      connectTimeout: 60000,
    },
  },
});

// Modelo do Usuário
const Usuario = sequelize.define('Usuario', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Modelo de Experiência Profissional
const ExperienciaProfissional = sequelize.define('ExperienciaProfissional', {
  empresa: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cargo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dataInicio: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  dataFim: {
    type: DataTypes.DATE,
  },
});

// Modelo de Educação
const Educacao = sequelize.define('Educacao', {
  instituicao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  curso: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dataInicio: {
    type: DataTypes.DATE, 
    allowNull: false,
  },
  dataFim: {
    type: DataTypes.DATE,
  },
});

// Modelo de Curso

const Curso = sequelize.define('Curso', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  instituicao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duracao: {
    type: DataTypes.STRING,
  },
});

// Relacionamentos
Usuario.hasMany(ExperienciaProfissional);
ExperienciaProfissional.belongsTo(Usuario);

Usuario.hasMany(Educacao);
Educacao.belongsTo(Usuario);

Usuario.hasMany(Curso);
Curso.belongsTo(Usuario);

// Sincronizando modelos com o banco de dados (sem forçar a atualização)
sequelize
  .sync()
  .then(() => {
    console.log('Modelos sincronizados com o banco de dados.');
  })
  .catch((error) => {
    console.error('Erro ao sincronizar modelos:', error);
  });

module.exports = {
  Usuario,
  ExperienciaProfissional,
  Educacao,
  Curso,
};
