const chai = import('chai');
const chaiHttp = import('chai-http');
const sinon = import('sinon');


const { expect } = chai;

// chai.use(chaiHttp);

// Define the base URL of your API server
const baseUrl = 'http://localhost:4000'; 

describe('GET /getUserByUserId/:id', () => {
    it('should get a user by their ID', (done) => {
      chai.request(baseUrl)
        .get('/getUserByUserId/1') 
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success').eql(1);
          expect(res.body).to.have.property('data');
          done();
        });
    });
  
    it('should return an error if user ID is invalid', (done) => {
      chai.request(baseUrl)
        .get('/getUserByUserId/invalid_id') 
        .end((err, res) => {
          expect(res).to.have.status(404); 
          expect(res.body).to.have.property('success').eql(0);
          expect(res.body).to.have.property('message').eql('User not found');
          done();
        });
    });
  
  });
  
  describe('GET /getUsers', () => {
    it('should get all users', (done) => {
      chai.request(baseUrl)
        .get('/getUsers')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success').eql(1);
          expect(res.body).to.have.property('data');
          done();
        });
    });
  
  });
  
  describe('PUT /updateUser', () => {
    it('should update a user', (done) => {
      chai.request(baseUrl)
        .put('/updateUser')
        .send({
          userId: 123, 
          username: 'updatedUsername', 
          email: 'updatedemail@example.com', 
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success').eql(1);
          expect(res.body).to.have.property('message').eql('Updated successfully');
          done();
        });
    });
  });
  
  describe('DELETE /deleteUser', () => {
    it('should delete a user', (done) => {
      chai.request(baseUrl)
        .delete('/deleteUser')
        .send({
            userId: 1
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success').eql(1);
          expect(res.body).to.have.property('message').eql('User deleted successfully');
          done();
        });
    });
  
    it('should return an error if user does not exist', (done) => {
      chai.request(baseUrl)
        .delete('/deleteUser')
        .send({
            userId: 1
        })
        .end((err, res) => {
          expect(res).to.have.status(404); // Assuming user not found leads to a not found error
          expect(res.body).to.have.property('success').eql(0);
          expect(res.body).to.have.property('message').eql('Record not found');
          done();
        });
    });
  
  });
  
  describe('POST /addPreference/:id', () => {
    it('should add a preference for a user', (done) => {
      chai.request(baseUrl)
        .post('/addPreference/1')
        .send({
            preference: 'new preference'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success').eql(1);
          expect(res.body).to.have.property('message').eql('Preference added successfully');
          done();
        });
    });
  
  });
  
  describe('DELETE /deletePreference/:id', () => {
    it('should delete a preference for a user', (done) => {
      chai.request(baseUrl)
        .delete('/deletePreference/1') 
        .send({
            index: 0,
            preference: 'new preference'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success').eql(1);
          expect(res.body).to.have.property('message').eql('Preference deleted successfully');
          done();
        });
    });
  
  });
  
  describe('PUT /updatePreference/:id', () => {
    it('should update a preference for a user', (done) => {
      chai.request(baseUrl)
        .put('/updatePreference/1') 
        .send({
            index: 0,
            preference: 'new preference'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success').eql(1);
          expect(res.body).to.have.property('message').eql('Preference updated successfully');
          done();
        });
    });
  
  
  });
