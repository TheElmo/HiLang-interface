import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../course.service';
import { CookieService } from '../cookie.service';


@Component({
    selector: 'app-my-courses',
    templateUrl: './my-courses.component.html',
    styleUrls: ['./my-courses.component.css']
})

export class MyCoursesComponent implements OnInit {
    miniMenu;
    subLanguages;
    subCourses;
    myCourses;
    favCourses;
    currentId: number;
    constructor(private _courses: CourseService, private _cookies: CookieService) {}

    //for debug no other use
    //---------------------------
    getCourses() {
        this._courses.getCourses().subscribe(
            data => {this.doWithData(data)},
            err => console.error(err)
        );
    }

    doWithData(data) {
        for(let i=0; i<data['length']; i++) {
            this.subCourses[0].courses.push(data[i].fields);
        }
    }
    //---------------------------
    getSubCourses() {
        this.subCourses = [];
        this._courses.getSubCourses(this._cookies.getValue()['user_id']).subscribe(
            data => {
                if(data['length'] != 0) {
                    this.handleCourseData(data, 0);
                }
            },
            err => console.log(err)
        );
    }

    getFavCourses() {
        this.favCourses = [];
        this._courses.getFavCourses(this._cookies.getValue()['user_id']).subscribe(
            data => {
                if(data['length'] != 0) {
                    this.handleCourseData(data, 1); 
                }
            },
            err => console.log(err)
        );
    }

    getMyCourses() {
        this.myCourses = [];
        this._courses.getUserCourses(this._cookies.getValue()['user_id']).subscribe( 
            data => {
                if(data['length'] != 0) {
                    this.handleCourseData(data, 2); 
                }
            },
            err => console.log(err)
        );
    }

    handleCourseData(data, type) {
        for(let i=0; i<data['length']; i++) {
            this._courses.getLangDetails(data[i].fields['trans_lang']).subscribe(
                languageData => {
                    this.handleLangDet(languageData,data, type);
                },
                err => console.log(err)
            );
        }
    }


    handleLangDet(langDet,data, type) {
        let courses = [];
        let author = "";
        for(let i = 0; i<data['length']; i++) {
            if(data[i].fields['trans_lang'] == langDet[0].pk) {
                this._courses.getUser(data[i].fields['user']).subscribe(
                    userName => {
                        courses.push(
                            {
                                id: data[i].pk,
                                description: data[i].fields['description'],
                                image: data[i].fields['image'],
                                name: data[i].fields['name'],
                                subscribers: data[i].fields['subscribers'],
                                author: userName[0].fields['name'] 
                            }
                        );
                    },
                    err => console.log(err)
                );   
            }
        }
        if(type === 0) {
            let unique = true;
            for(let lang of this.subCourses) {
                if(lang.id === langDet[0].pk) {
                    unique = false;
                }
            }
            if(unique) {
                this.subCourses.push( {
                    id: langDet[0].pk,
                    name: langDet[0].fields['name'],
                    flag: langDet[0].fields['flag'],
                    courses: courses
                });
            }
            
        } else if(type === 1) {
            let unique = true;
            for(let lang of this.favCourses) {
                if(lang.id === langDet[0].pk) {
                    unique = false;
                }
            }
            if(unique) {
                this.favCourses.push( {
                    id: langDet[0].pk,
                    name: langDet[0].fields['name'],
                    flag: langDet[0].fields['flag'],
                    courses: courses
                });
            }
        } else if(type === 2) {
            let unique = true;
            for(let lang of this.myCourses) {
                if(lang.id === langDet[0].pk) {
                    unique = false;
                }
            }
            if(unique) {
                this.myCourses.push({
                    id: langDet[0].pk,
                    name: langDet[0].fields['name'],
                    flag: langDet[0].fields['flag'],
                    courses: courses
                });
            }
        }
    }


    ngOnInit() {
        this.getSubCourses();
        this.getFavCourses();
        this.getMyCourses();
        this.miniMenu = [
            {name: "Subscribed courses", function: () => this.showSubCourses()},
            {name: "Created by me",        function: () => this.showUserCourses()},
            {name: "Favourite Courses", function: () => this.showFavCourses()},
        ];
    }

    showSubCourses() {
        this.getSubCourses();
        this.hideAll();
        document.getElementById('subCourses').style.display = 'block';
    }

    showUserCourses() {
        this.getMyCourses();
        this.hideAll();
        document.getElementById('myCourses').style.display = 'block';
        document.getElementById('addCourse').style.display = 'block';
    }

    showFavCourses() {
        this.getFavCourses();
        this.hideAll();
        document.getElementById('favCourses').style.display = 'block';
    }

    hideAll() {
        document.getElementById('addCourse').style.display = 'none';
        document.getElementById('subCourses').style.display = 'none';
        document.getElementById('myCourses').style.display = 'none';
        document.getElementById('favCourses').style.display = 'none';
    }

    addCourseInput() {
        document.getElementById('courseInput').style.display = 'block';
        let courseInput = (<HTMLInputElement>document.getElementById('courseInput'));

        courseInput.onkeypress = function(event) {
            if(event.keyCode === 13) {
                let newCourse = {id: this.currentId, name: courseInput.value, author: ""}
                this._courses.createCourse({name: courseInput.value}).subscribe(
                            this.showSubCourses()
                    );
                courseInput.value = "";
                courseInput.style.display = 'none';
            }
        }.bind(this);
    }
}