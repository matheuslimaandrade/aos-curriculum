require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { Usuario, ExperienciaProfissional, Educacao, Curso } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('API para Gerenciamento de Currículos');
});

app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id, {
      include: [
        { model: Educacao },
        { model: Curso },
        { model: ExperienciaProfissional },
      ],
    });
    

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuário por ID:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/usuarios', async (req, res) => {
  try {
    if (!req.body.nome) {
      return res.status(400).json({ error: 'O campo nome é obrigatório' });
    }

    const usuario = await Usuario.create(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    console.error('Erro ao criar usuário:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/usuarios/:id/experienciaprofissional', async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const { empresa, cargo, dataInicio, dataFim } = req.body;
    if (!empresa || !cargo || !dataInicio) {
      return res.status(400).json({ error: 'Campos obrigatórios não fornecidos' });
    }

    const experiencia = await ExperienciaProfissional.create({
      empresa,
      cargo,
      dataInicio,
      dataFim,
    });

    await usuario.addExperienciaProfissional(experiencia);

    res.status(201).json(experiencia);
  } catch (error) {
    console.error('Erro ao adicionar experiência profissional:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/usuarios/:id/educacao', async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const educacao = await Educacao.create(req.body);
    await usuario.addEducacao(educacao);

    res.status(201).json(educacao);
  } catch (error) {
    console.error('Erro ao adicionar educação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/usuarios/:id/cursos', async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const curso = await Curso.create(req.body);
    await usuario.addCurso(curso);

    res.status(201).json(curso);
  } catch (error) {
    console.error('Erro ao adicionar curso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

