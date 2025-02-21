# Technical task | ERP.AERO | Node.js dev

## Make a service with REST API

### Install Environment

```yml
node.js version: v22.13.1
```

### Install Dependencies

```
npm i
```

### Environment Variables

create a `.env` file in the root folder

```yaml
PORT=PORT_NUMBER
DB_HOST=DB_HOST
DB_USER=USER_NAME
DB_PASSWORD=PASSWORD
DB_NAME=DB_NAME
JWT_SECRET=YOUR_SECRET
JWT_REFRESH_SECRET=YOUR_REFRESH_SECRET
FILE_UPLOAD_PATH=UPLOAD_PATH
```

### Run project

Please refer to the `scripts` part of **./package.json** file:

```json
"start": "node src/index.js",
"dev": "nodemon src/index.js"
```

### Visit

- http://localhost:5680

---

- http://localhost:5680/signup

## ![Postman SignUp Test](assets/img/screenshots/screenshot_signup.png)

- http://localhost:5680/signin

## ![Postman SignIn Test](assets/img/screenshots/screenshot_signin.png)

- http://localhost:5680/signin/new_token

## ![Postman NewToken Test](assets/img/screenshots/screenshot_newtoken.png)

- http://localhost:5680/info

## ![Postman Info Test](assets/img/screenshots/screenshot_info.png)

- http://localhost:5680/logout

## ![Postman Logout Test](assets/img/screenshots/screenshot_logout.png)

- http://localhost:5680/file/upload

## ![Postman FileUpload Test](assets/img/screenshots/screenshot_fileupload.png)

- http://localhost:5680/file/list

## ![Postman GetFileList Test](assets/img/screenshots/screenshot_getfilelist.png)

- http://localhost:5680/file/list?page=2&list_size=5

## ![Postman GetFileList Test](assets/img/screenshots/screenshot_getfilelist1.png)

- http://localhost:5680/file/:id

## ![Postman GetFile Test](assets/img/screenshots/screenshot_getfile.png)

- http://localhost:5680/file/download/:id

## ![Postman DownloadFile Test](assets/img/screenshots/screenshot_downloadfile.png)

- http://localhost:5680/file/update/:id

## ![Postman UpdateFile Test](assets/img/screenshots/screenshot_updatefile.png)

- http://localhost:5680/file/delete/:id

## ![Postman DeleteFile Test](assets/img/screenshots/screenshot_deletefile.png)

---

&copy; 2025 Arsen Girgoryan.

All Rights Reserved.
