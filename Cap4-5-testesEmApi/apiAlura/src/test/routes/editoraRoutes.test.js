import {
  afterEach, beforeEach, describe, expect,
} from '@jest/globals';
import request from 'supertest';
import { response } from 'express';
import app from '../../app';

let server;
beforeEach(() => {
  const port = 3000;
  server = app.listen(port);
});

describe('GET em /editoras', () => {
  it('Deve retornar uma lista de editoras', async () => {
    const response = await request(app)
      .get('/editoras')
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(200);

    expect(response.body[0].email).toEqual('e@e.com');
  });
});

let idResponse;
describe('POST em /editoras', () => {
  it('Deve adicionar uma nova editora', async () => {
    const resposta = await request(app)
      .post('/editoras')
      .send({
        nome: 'CDC',
        cidade: 'São Paulo',
        email: 's@s.com',
      })
      .expect(201);

    idResponse = resposta._body.content.id;
  });

  it('Deve não adicionar nada ao passar o body vazio', async () => {
    await request(app)
      .post('/editoras')
      .send({})
      .expect(400);
  });
});
describe('GET em /editoras/id', () => {
  it('Deve retornar o recurso selecionado', async () => {
    await request(app)
      .get(`/editoras/${idResponse}`)
      .expect(200);
  });
});

describe('PUT em /editoras/id', () => {
  it('Deve alterar o campo nome', async () => {
    await request(app)
      .put(`/editoras/${idResponse}`)
      .send({
        nome: 'Casa do Código',
      })
      .expect(204);
  });
});
describe('DELETE em /editoras/id', () => {
  it('Deve deletar o recurso adicionado no teste anterior', async () => {
    await request(app)
      .delete(`/editoras/${idResponse}`)
      .expect(200);
  });
});

afterEach(() => {
  server.close();
});
