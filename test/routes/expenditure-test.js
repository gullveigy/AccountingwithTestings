let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
chai.use(require('chai-things'));
chai.use(chaiHttp);
let _ = require('lodash' );

describe('Expenditures', function (){
    // TODO
    describe('POST /expenditures', function () {
        it('should return confirmation message and update database', function(done) {
            let expenditure = {
                username: 'April',
                date: '2018-12-04',
                payment: 'Visa card' ,
                amount: 10,
                description: 'glasses'
            };
            chai.request(server)
                .post('/expenditures')
                .send(expenditure)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Expenditure Successfully Added!' );
                    let expenditure = res.body.data;
                    expect(expenditure).to.include({description: 'glasses', date: '2018-12-04'});
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/expenditures')
                .end(function(err, res) {
                    let result = _.map(res.body, (expenditure) => {
                        return { payment: expenditure.payment,
                            amount: expenditure.amount };
                    }  );
                    expect(result).to.include( { payment: 'Visa card', amount: 10  } );
                    done();
                });
            //chai.request(server)
            //.delete('/expenditures/fuzzydelete/2018-12')
            //.end(function(err, res) {
            //done();
            //});
        });  // end-after
    });





    describe('PUT /expenditures/:id/changeExinfo', () => {
        describe ('when id is valid',function() {
            it('should return a confirmation message and update database', function (done) {
                let expenditure = {
                    username: 'gullveig',
                    description: 'latte',
                    date: '2018-10-14',
                    payment: 'Alipay',
                    amount: 4
                };
                chai.request(server)
                    .put('/expenditures/5bdd7ec0ef72153750b2df72/changeExinfo')
                    .send(expenditure)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('Message').equal('Expenditure Successfully Changed!');
                        let expenditure = res.body.data;
                        expect(expenditure).to.include({description: 'latte', date: '2018-10-14'});
                        done();
                    });
            });
            after(function  (done) {
                chai.request(server)
                    .get('/expenditures')
                    .end(function(err, res) {
                        let result = _.map(res.body, (expenditure) => {
                            return { description: expenditure.description,
                                date: expenditure.date };
                        }  );
                        expect(result).to.include( { description: 'latte', date: '2018-10-14'  } );
                        //done();
                    });
                let expenditure = {
                    username: 'gullveig',
                    description: 'Latte',
                    date: '2018-10-15',
                    payment: 'Alipay',
                    amount: 4
                };
                chai.request(server)
                    .put('/expenditures/5bdd7ec0ef72153750b2df72/changeExinfo')
                    .send(expenditure)
                    .end(function (err, res) {
                        done();
                    });
            });  // end-after
        });
        describe('when id is invalid',function() {
            it('should return a 404 and a message for invalid expenditure id', function (done) {
                chai.request(server)
                    .put('/expenditures/1100001/changeExinfo')
                    .end(function (err, res) {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('Message', 'Sorry! Cannot find the expenditure by this id!');
                        done();
                    });
            });
        });
    });



    describe('DELETE /expenditures/:id', () => {
        describe ('when id is valid',function(){
            //let exId;
            //before(function () {
            //chai.request(server)
            //.get('/expenditures')
            //.end(function(err, res) {
            //const exId = res.body[12]._id;
            //});
            //});
            it('should return a confirmation message and update database ', function(done) {
                chai.request(server)
                    .get('/expenditures')
                    .end(function(err, res) {
                        const exId = res.body[12]._id;
                        chai.request(server)
                            .delete('/expenditures/' + exId)
                            .end(function(err, res) {
                                expect(res).to.have.status(200);
                                expect(res.body).to.have.property('message','Expenditure Successfully Deleted!' ) ;
                                done();
                            });
                    });
                //.delete('/expenditures/' + exId)
                //.end(function(err, res) {
                //expect(res).to.have.status(200);
                //expect(res.body).to.have.property('message','Expenditure Successfully Deleted!' ) ;
                //done();
                //});

            });
            after(function  (done) {
                chai.request(server)
                    .get('/expenditures')
                    .end(function(err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        let result = _.map(res.body, function(expenditure) {
                            return { payment: expenditure.payment,
                                amount: expenditure.amount };
                        }  );
                        //expect(result).to.have.lengthOf(1) ;
                        //expect(result).to.not.include( { paymenttype: 'Paypal', amount: 1600  } );
                        expect(result).to.not.include( { payment: 'Visa card', amount: 10  } );
                        done();
                    });
            });  // end after
        });
        describe('when id is invalid',function(){
            it('should return a 404 and a message for invalid expenditure id', function(done) {
                chai.request(server)
                    .delete('/expenditures/1100001')
                    .end(function(err, res) {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('message','Expenditure NOT DELETED!' ) ;
                        done();
                    });
            });

        });

    });







    describe('DELETE /expenditures/fuzzydelete/:date',  () => {
        before(function () {
            let expenditure = {
                username: 'April',
                date: '2018-12-04',
                payment: 'Visa card' ,
                amount: 10,
                description: 'glasses'
            };
            chai.request(server)
                .post('/expenditures')
                .send(expenditure)
        });
        it('should return a confirmation message and update database ', function(done) {
            chai.request(server)
                .delete('/expenditures/fuzzydelete/2018-12')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('Message','Expenditure Deleted Successfully!' ) ;
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/expenditures')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    let result = _.map(res.body, function(expenditure) {
                        return { payment: expenditure.payment,
                            amount: expenditure.amount };
                    }  );
                    //expect(result).to.have.lengthOf(1) ;
                    //expect(result).to.not.include( { paymenttype: 'Paypal', amount: 1600  } );
                    expect(result).to.not.include( //{ payment: 'cash', amount: 5.2  },
                        { payment: 'Visa card', amount: 10  });
                    done();
                });
        });  // end after
    });



    

    describe('GET /expenditures',  () => {
        it('should return all the expenditures in an array', function(done) {
            chai.request(server)
                .get('/expenditures')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(12);
                    let result = _.map(res.body, (expenditure) => {
                        return { description: expenditure.description,
                                  amount: expenditure.amount }
                    });
                    expect(result).to.include( { description: 'Latte', amount: 4  });
                    expect(result).to.include( { description: 'cheese', amount: 3  } );
                    expect(result).to.include( { description: 'chips', amount: 2.5  } );
                    expect(result).to.include( { description: 'cola', amount: 2.1  } );
                    expect(result).to.include( { description: 'eye shadow', amount: 16  } );
                    expect(result).to.include( { description: 'nyx pencil', amount: 9.99  } );
                    expect(result).to.include( { description: 'haribo', amount: 6  } );
                    expect(result).to.include( { description: 'sunscreen cream', amount: 13  } );
                    expect(result).to.include( { description: 'foundation', amount: 36  } );
                    expect(result).to.include( { description: 'premier', amount: 34  } );
                    expect(result).to.include( { description: 'the ordinary', amount: 5.95  } );
                    expect(result).to.include( { description: 'pork', amount: 4  } );
                    done();
                });

        });
    });




    describe('GET /expenditures/:id', function () {
        it('should return a specific expenditure in an array', function(done) {
            chai.request(server)
                .get('/expenditures/5bdd812eef72153750b2df7d')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (expenditure) => {
                        return { description: expenditure.description,
                                  amount: expenditure.amount }
                    });
                    expect(result).to.include( { description: "pork", amount: 4  } );
                    //expect(result).to.include( { description: "Acide Hyaluronique", amount: 6.95  } );
                    //expect(result).to.include( { description: "Facteurs Naturels", amount: 5.95  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });

        });
        it('should return a 404 and a message for invalid expenditure id', function(done) {
            chai.request(server)
                .get('/expenditures/1100001')
                .end(function(err, res) {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('Message','Sorry! Cannot find the expenditure of this id!' ) ;
                    done();
                });
        });

    });




    describe('GET /expenditures/daterecord/:date',  () => {
        it('should return a specific expenditure of one date in an array', function(done) {
            chai.request(server)
                .get('/expenditures/daterecord/2018-11-01')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (expenditure) => {
                        return { description: expenditure.description,
                                  amount: expenditure.amount }
                    });
                    expect(result).to.include( //{ description: 'RIP card', amount: 300  },
                         { description: 'haribo', amount: 6 }
                    );
                    //expect(result).to.include( { description: "Acide Hyaluronique", amount: 6.95  } );
                    //expect(result).to.include( { description: "Facteurs Naturels", amount: 5.95  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });
        });
        it('should return a message for daterecord which do not exist', function(done) {
            chai.request(server)
                .get('/expenditures/daterecord/2019-10-18')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    //expect(res.body.length).to.equal(0);
                    expect(res.body).to.have.property('Message','Sorry! Cannot find the expenditure of this date!' ) ;
                    done();
                });
        });

    });



    describe('GET /expenditures/inamountorder',  () => {
        it('should return all the expenditures in ascending order of amount in an array', function(done) {
            chai.request(server)
                .get('/expenditures/inamountorder')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(12);
                    let result = _.map(res.body, (expenditure) => {
                        return { description: expenditure.description,
                                  amount: expenditure.amount }
                    });
                    expect(result).to.include( { description: 'cola', amount: 2.1  },
                                               { description: 'chips', amount: 2.5 },
                                               { description: 'cheese', amount: 3 },
                                               { description: 'Latte', amount: 4 },
                                               { description: 'pork', amount: 4 },
                                               { description: 'the ordinary', amount: 5.95 },
                                               { description: 'haribo', amount: 6 },
                                               { description: 'nyx pencil', amount: 9.99 },
                                               { description: 'sunscreen cream', amount: 13 },
                                               { description: 'eye shadow', amount: 16 },
                                               { description: 'premier', amount: 34 },
                                               { description: 'foundation', amount: 36 });
                    //expect(result).to.include( { description: "Acide Hyaluronique", amount: 6.95  } );
                    //expect(result).to.include( { description: "Facteurs Naturels", amount: 5.95  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });

        });
    });




    describe('GET /expenditures/indateorder',  () => {
        it('should return all the expenditures in ascending order of date in an array', function(done) {
            chai.request(server)
                .get('/expenditures/indateorder')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(12);
                    let result = _.map(res.body, (expenditure) => {
                        return { description: expenditure.description,
                                  date: expenditure.date }
                    });
                    expect(result).to.include( { description: 'Latte', date: '2018-10-15'  },
                                               { description: 'cheese', date: '2018-10-15' },
                                               { description: 'chips', date: '2018-10-16' },
                                               { description: 'cola', date: '2018-10-19' },
                                               { description: 'eye shadow', date: '2018-10-28' },
                                               { description: 'nyx pencil', date: '2018-10-29' },
                                               { description: 'haribo', date: '2018-11-01' },
                                               { description: 'sunscreen cream', date: '2018-11-03' },
                                               { description: 'foundation', date: '2018-11-05' },
                                               { description: 'premier', date: '2018-11-15' },
                                               { description: 'the ordinary', date: '2018-11-26'},
                                               { description: 'pork', date: '2018-11-27'} );
                    //expect(result).to.include( { description: "Acide Hyaluronique", amount: 6.95  } );
                    //expect(result).to.include( { description: "Facteurs Naturels", amount: 5.95  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });

        });
    });





    describe('GET /expenditures/monthrecord/:date',  () => {
        it('should return expenditure records of one month in ascending order of date in an array', function(done) {
            chai.request(server)
                .get('/expenditures/monthrecord/2018-10')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(6);
                    let result = _.map(res.body, (expenditure) => {
                        return { description: expenditure.description,
                                  date: expenditure.date }
                    });
                    expect(result).to.include( { description: 'Latte', date: '2018-10-15'  },
                                               { description: 'cheese', date: '2018-10-15' },
                                               { description: 'chips', date: '2018-10-16' },
                                               { description: 'cola', date: '2018-10-19' },
                                               { description: 'eye shadow', date: '2018-10-28' },
                                               { description: 'nyx pencil', date: '2018-10-29' }
                    );
                    //expect(result).to.include( { description: "Acide Hyaluronique", amount: 6.95  } );
                    //expect(result).to.include( { description: "Facteurs Naturels", amount: 5.95  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });

        });
        it('should return a message for monthlyrecord cannot found', function(done) {
            chai.request(server)
                .get('/expenditures/monthrecord/2018-12')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    //expect(res.body.length).to.equal(0);
                    expect(res.body).to.have.property('Message','Sorry! Cannot find the expenditures of this month!' ) ;
                    done();
                });
        });

    });





    describe('GET /expenditures/fuzzy/:description',  () => {
        it('should return relevant expenditure records matching the fuzzy description in an array', function(done) {
            chai.request(server)
                .get('/expenditures/fuzzy/ch')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(2);
                    let result = _.map(res.body, (expenditure) => {
                        return { description: expenditure.description,
                                  amount: expenditure.amount }
                    });
                    expect(result).to.include( { description: 'cheese', amount: 3  },
                                               { description: 'chips', amount: 2.5 }
                    );
                    //expect(result).to.include( { description: "Acide Hyaluronique", amount: 6.95  } );
                    //expect(result).to.include( { description: "Facteurs Naturels", amount: 5.95  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });

        });
        it('should return a message for no relevant records', function(done) {
            chai.request(server)
                .get('/expenditures/fuzzy/123')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    //expect(res.body.length).to.equal(0);
                    expect(res.body).to.have.property('Message','Sorry! Cannot find this expenditure by description!' ) ;
                    done();
                });
        });

    });




    describe('GET /expenditures/tamounts',  () => {
        it('should return the total amounts of expenditures in an array', function(done) {
            chai.request(server)
                .get('/expenditures/tamounts')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    //let result = _.map(res.body, (expenditure) => {
                    //return { description: expenditure.description,
                    //amount: expenditure.amount }
                    //});
                    expect(res.body).to.include({ totalamounts: 136.54 } );
                    //expect(result).to.include( { description: "Acide Hyaluronique", amount: 6.95  } );
                    //expect(result).to.include( { description: "Facteurs Naturels", amount: 5.95  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });

        });


    });




    describe('GET /expenditures/gettotal/:date',  () => {
        it('should return total amounts of expenditure of one month in an array', function(done) {
            chai.request(server)
                .get('/expenditures/gettotal/2018-10')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    //let result = _.map(res.body, (expenditure) => {
                    //return { description: expenditure.description,
                    //amount: expenditure.amount }
                    //});
                    expect(res.body).to.include({ monthlyamounts: 37.59 } );
                    //{ description: 'books', amount: 15 }
                    //);
                    //expect(result).to.include( { description: "Acide Hyaluronique", amount: 6.95  } );
                    //expect(result).to.include( { description: "Facteurs Naturels", amount: 5.95  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });

        });
        it('should return a message for no relevant expenditure records', function(done) {
            chai.request(server)
                .get('/expenditures/gettotal/2018-12')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    //expect(res.body.length).to.equal(0);
                    expect(res.body).to.have.property('Message','Sorry! Cannot find the expenditures of this month!' ) ;
                    done();
                });
        });

    });









});
