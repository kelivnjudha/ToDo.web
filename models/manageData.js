const fs = require('fs');
const path = require('path');

const root = require('../utils/root');
//const url = require('./urlGenerator');
const url = require('../utils/hex_key');


const userPath = path.join(root, 'JSON', 'user');

//let isUser = false;

const generateDataFile = (dataPath, filename) => {
    const pathDir = path.join(dataPath, filename);
    const structure = {};
    const jsonString = JSON.stringify(structure, null, 2);
    fs.writeFile(pathDir, jsonString, 'utf-8', (err) => {
        if(err){
            console.log(err);
            return;
        }
    })
}

const findUser = (username) => {
    return new Promise((resolve, reject) => {
        fs.readdir(userPath, (err, files) => {
            if(err){
                reject(err);
            };
            const userExists = files.some(file => file.split('.json').join('').toLowerCase() === username.toLowerCase());
            if(userExists){
                resolve(true);
            } else {
                reject(false);
            }
        })
    })
}

const changeFileName = (oldPath, newPath) => {
    return new Promise((resolve, reject) => {
        fs.rename(oldPath, newPath, (err) => {
            if(err){
                reject(err);
            };
            resolve({newPath});
        })
    })
}

// This function edit username in json file / if resolve function will return true
const editUsernameJSON = (path, username) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, data) => {
            if(err){
                console.log(err);
                reject(err);
                return;
            };
            try{
                const jsonData = JSON.parse(data);
                jsonData.USER.username = username;
                const updatedJsonString = JSON.stringify(jsonData, null, 2);
                fs.writeFile(path, updatedJsonString, 'utf-8', (err) => {
                    if(err){
                        console.log(err);
                        reject(err);
                        return;
                    };
                    resolve(true);
                })
            }catch (error){
                console.log(error);
                reject(error);
            }
        } )
    })
}

// This function accept two args which are path to the json and url to add or edit.
// Once the function done added or edited successfully, it will return true.
const editProfileUrl = (path, url) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, data) => {
            if(err){
                console.log(err);
                reject(err);
                return;
            };
            try{
                const jsonData = JSON.parse(data);
                jsonData.USER.profileUrl = url;
                const updatedJsonString = JSON.stringify(jsonData, null, 2);
                fs.writeFile(path, updatedJsonString, 'utf-8', (err) => {
                    if(err){
                        console.log(err);
                        reject(err);
                        return;
                    };
                    resolve(true);
                })
            }catch(error){
                console.log(error);
                reject(error);
            }
        })
    })
}

class User {
    constructor(username, passcode){
        this.username = username;
        this.passcode = passcode;
    }

    register() {
        return new Promise((resolve, reject) => {
            fs.readdir(userPath, (err, files) => {
                if (err) {
                    return reject(err); // Handle any file system errors
                }
    
                const userExists = files.some(file => 
                    file.split('.json').join('').toLowerCase() === this.username.toLowerCase()
                );
    
                if (userExists) {
                    reject(`${this.username} already exists. Please Login`);
                } else {
                    resolve(true);
                }
            });
        });
    }

    login(){
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(userPath, `${this.username}.json`), 'utf8', (err, data) => {
                if(err){
                    console.log(err);
                    reject(err)
                    return;
                }
                try{
                    const jsonData = JSON.parse(data);
                    console.log(jsonData);
                    if(this.username === jsonData.USER.username && this.passcode === jsonData.USER.passcode){
                        jsonData.USER.access = true;
                        jsonData.USER.activeUrl = `/${url()}/toDo`;
                        
                        const updatedJsonString = JSON.stringify(jsonData, null, 2);
                        fs.writeFile(path.join(userPath, `${this.username}.json`), updatedJsonString, 'utf-8', (err) => {
                            if(err){
                                console.log(err);
                                reject(err);
                                return;
                            }
                            resolve(jsonData.USER.activeUrl);
                        });
                    }else{
                        reject('Invalid username or password');
                    }
                }catch{
                    reject('Error parsing JSON');
                };
            });
        });
    }

    logout(){
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(userPath, `${this.username}.json`), 'utf8', (err, data) => {
                if(err){
                    console.log(err);
                    reject(err);
                    return;
                }
                try{
                    const jsonData = JSON.parse(data);
                    console.log(jsonData);
                    if(this.username === jsonData.USER.username && this.passcode === jsonData.USER.passcode){
                        jsonData.USER.access = false;
                        jsonData.USER.activeUrl = '';
                        
                        const updatedJsonString = JSON.stringify(jsonData, null, 2);
                        fs.writeFile(path.join(userPath, `${this.username}.json`), updatedJsonString, 'utf-8', (err) => {
                            if(err){
                                console.log(err);
                                reject(err);
                                return;
                            }
                            resolve(true);
                        })
                    }else{
                        reject('Invalid username or password');
                    }
                }catch{
                    reject('Error parsing JSON');
                }
            })
        })
    }

    createUser(){
        return new Promise((resolve, reject) => {
            const user = {
                USER:{
                    username:this.username,
                    passcode:this.passcode,
                    themeSetting:'default',
                    database:`${this.username}.json`,
                    profileUrl: '',
                    access:false,
                    activeUrl: ''
                }
            };
    
            const jsonString = JSON.stringify(user, null, 2); // Pretty print with 2 spaces
    
            const userPath = path.join(root, 'JSON', 'user', `${this.username}.json`);
            fs.writeFile(userPath, jsonString, (err) => {
                if(err){
                    reject(err);
                }else{
                    generateDataFile(path.join(root, 'JSON', 'data'), `${this.username}.json`)
                    resolve(true);
                };
            });
        });
    }

    getUserProfileUrl(){
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(userPath, `${this.username}.json`), 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                try {
                    const jsonData = JSON.parse(data);
                    console.log(jsonData.USER.profileUrl);
                    resolve(jsonData.USER.profileUrl);
                } catch (error) {
                    reject('Error parsing JSON');
                }
            });
        });
    }

    getUsername(){
        return this.username;
    }

    access(){
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(userPath, `${this.username}.json`), 'utf8', (err, data) => {
                if(err){
                    reject(err);
                    return;
                }
                try{
                    const jsonData = JSON.parse(data);
                    //console.log(jsonData.USER.access);
                    resolve(jsonData.USER.access);
                }catch (error){
                    reject('Error parsing JSON');
                }
            });
        });
    }

    theme(){
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(userPath, `${this.username}.json`), 'utf-8', (err, data) => {
                if(err){
                    reject(err);
                    return;
                }
                try{
                    const jsonData = JSON.parse(data);
                    //console.log(jsonData.USER.themeSetting);
                    resolve(jsonData.USER.themeSetting);
                }catch (error){
                    reject('Error parsing JSON');
                }
            });
        });
    }

    // account

    changePassword(newPassword){
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(userPath, `${this.username}.json`), 'utf-8', (err, data) => {
                if(err){
                    reject(err);
                    return;
                }
                try{
                    const jsonData = JSON.parse(data);
                    if(this.passcode === jsonData.USER.passcode){
                        jsonData.USER.passcode = newPassword;
                        const updatedJsonString = JSON.stringify(jsonData, null, 2);
                        // Write the updated json
                        fs.writeFile(path.join(userPath, `${this.username}.json`), updatedJsonString, 'utf-8', (err) => {
                            if(err){
                                console.log(err);
                                reject(err);
                                return;
                            }
                            resolve(updatedJsonString);
                        });
                    }else{
                        reject('Incorrect Password.');
                    };
                }catch (error){
                    console.log('Error parsing JSON');
                };
            });
        });
    }

    async changeUsername(newUsername){
        try{
            let isUser = await findUser(this.username);
            if(isUser){
                const oldUsername = path.join(userPath, `${this.username}.json`);
                const changeNewName = path.join(userPath, `${newUsername}.json`);
                //console.log(oldUsername, changeNewName)
                const chFilename = await changeFileName(oldUsername, changeNewName);
                console.log(chFilename.newPath, changeNewName);
                if(chFilename.newPath === changeNewName){
                    console.log('/n RUNNING EditUsername Function.....')
                    const editUsername = await editUsernameJSON(changeNewName, newUsername);
                    if(editUsername){
                        return true;
                    }else{
                        console.error('Unexpected Error Occoured.');
                    }
                }
            }
        }catch (error){
            console.log(error)
        }
    }

    async changeProfileUrl(Url){
        try{
            let isUser = await findUser(this.username);
            if(isUser){
                const filePath = path.join(userPath, `${this.username}.json`);
                const urlDone = await editProfileUrl(filePath, Url);
                if(urlDone){
                    return true;
                };
            }
        }catch(error){
            console.log(error);
        }
    }
}

module.exports = User;