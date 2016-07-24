import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';


@Injectable()
export class QuestionService {
    http: Http;
    base: String;
    credentials;
    storage: Storage;
    questions: Array<Object>;
    constructor(http: Http) {
      this.http = http;
      this.questions = null;
      this.base = 'https://messageqaappserver.herokuapp.com';
    }
    setToken(token) {
      return localStorage.setItem('messageqatoken', token);
    }

    getToken() {
      return localStorage.getItem('messageqatoken');
    }

    isSessionActive() {
      return localStorage.getItem('messageqatoken') ? true : false;
    }
    setTherapistToken(token) {
      localStorage.setItem('therapisttoken', token);
    }
    setTherapistID(token) {
      localStorage.setItem('therapistid', token);
    }
    getTherapistID() {
      return localStorage.getItem('therapistid');
    }

    getTherapistToken() {
      return localStorage.getItem('therapisttoken');
    }

    isTherapistSessionActive() {
      return localStorage.getItem('therapisttoken') ? true : false;
    }

    signin(form) {
      return new Promise(resolve => {
        // We're using Angular HTTP provider to request the data,
        // then on the response, it'll map the JSON data to a parsed JS object.
        // Next, we process the data and resolve the promise with the new data.
        this.http.post(this.base+'/api/v1/messageqa/therapistauth/login', form)
          .subscribe( data => {
            resolve(data);
          }
        );
      });

    }
    signup(form) {
      return this.http.post(this.base+'/api/v1/messageqa/auth/register', form)
        .subscribe(
        data => {return data;},
        err => {return err;},
        () => {console.log('Random Quote Complete');}
      );
    }
    getAll(email) {
      this.http.get(this.base+'/api/v1/messageqa/data/list?token=' + email)
          .subscribe(
            data => {return data;},
            err => {return err;},
            () => {console.log('Random Quote Complete');}
      );
    }
    getTherapistAll(id) {
      console.log("i", id);
      return new Promise(resolve => {
        // We're using Angular HTTP provider to request the data,
        // then on the response, it'll map the JSON data to a parsed JS object.
        // Next, we process the data and resolve the promise with the new data.
        this.http.get(this.base+'/api/v1/messageqa/data/therapistquestionlist?token=' + id)
          .subscribe(data => {
            // we've got back the raw data, now generate the core schedule data
            // and save the data for later reference
            resolve(data);
          });
      });
    }
    findAll(email) {
      this.http.get(this.base+'/api/v1/messageqa/data/listall?token=' + email)
          .subscribe(
          data => {return data;},
          err => {return err;},
          () => {console.log('Random Quote Complete');}
      );
    }
    getOne(id, email) {
      this.http.get(this.base+'/api/v1/messageqa/data/item/' + id + '?token=' + email)
          .subscribe(
          data => {return data;},
          err => {return err;},
          () => {console.log('Random Quote Complete');}
      );
    }
    saveItem(form, email) {
      return this.http.post(this.base+'/api/v1/messageqa/data/item?token=' + email, form)
        .subscribe(
        data => {return data;},
        err => {return err;},
        () => {console.log('Random Quote Complete');}
      );
    }
    putItem(id, form, email) {

      return this.http.put(this.base+'/api/v1/messageqa/data/item/' + id + '?token=' + email, form)
        .subscribe(
        data => {return data;},
        err => {return err;},
        () => {console.log('Random Quote Complete');}
      );
    }
    deleteItem(id, email) {
      return this.http.delete(this.base+'/api/v1/messageqa/data/item/' + id + '?token=' + email)
        .subscribe(
        data => {return data;},
        err => {return err;},
        () => {console.log('Random Quote Complete');}
      );
    }
    getUser(email) {
      this.http.get(this.base+'/api/v1/messageqa/auth?token=' + email)
          .subscribe(
          data => {return data;},
          err => {return err;},
          () => {console.log('Random Quote Complete');}
      );
    }

}
