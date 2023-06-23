import json
import bcrypt
from datetime import datetime
from wheezy.web import authorize
from wheezy.security import Principal
from wheezy.web.handlers import BaseHandler


from main import Users
from json_validation import validation_func


class NonLogHomeHandler(BaseHandler):
    def get(self):
        if self.principal == None:
            return self.render_response("non_log_home.html")
        if self.principal.roles[0] == "":
            user_id = self.principal.id
            users = Users()
            login = users.loginName(user_id)[1]
            return self.render_response("requests.html",login=login)

        else:
            user_id = self.principal.id
            user_rights = [self.principal.roles[0]]
            if " " in user_rights[0]:
                user_rights = user_rights[0].split(" ")
            users = Users()
            login = users.loginName(user_id)[1]
            login = login\
                .replace("<", "&lt;")\
                .replace(">", "&gt;")\
                .replace('"', "&quot;")\
                .replace("'", "&#39;")

            return self.render_response("log_home.html", login=login, user_rights=user_rights)
        


class RegisterHandler(BaseHandler):
    def get(self):
        if self.principal != None:
            if self.principal.roles != "":
                user_id = self.principal.id
                user_rights = self.principal.roles[0]
                users = Users()
                login = users.loginName(user_id)[1]
                login = login\
                    .replace("<", "&lt;")\
                    .replace(">", "&gt;")\
                    .replace('"', "&quot;")\
                    .replace("'", "&#39;")
                return self.render_response("log_home.html", login=login)
            return self.render_response("queue.html")

        return self.render_response("reg_page.html")


class LoginHandler(BaseHandler):
    def get(self):
        if self.principal != None:
            return self.redirect_for("home")

        return self.render_response("login_page.html")


class SignUserHandler(BaseHandler):
    def post(self):
        # if self.principal.roles != "":
        form = self.request.form
        users = Users()
        new_user_name = form['login'][0]
        new_user_password = form['password'][0]
        # new_user_rights = form['rights'][0]
        if new_user_password != form['verify'][0]:
            return self.json_response(
                {
                    "status": "Fail",
                    "message": "Passwords dont match",
                    "field": "verify"
                })
        if users.check_username(new_user_name):
            return self.json_response(
                {
                    "status": "Fail",
                    "message": "Login exists",
                    "field": "login"
                })
        hashed_password = bcrypt.hashpw(new_user_password.encode(), bcrypt.gensalt())
        users.sign_up(new_user_name, hashed_password, "")
        user = users.login(new_user_name, hashed_password)
        self.principal = Principal(id=str(user[0]), roles=["",])

        return self.json_response({"status": "ok"})



class LoginUserHandler(BaseHandler):
    def post(self):
        form = self.request.form
        users = Users()
        login = form["login"][0]
        password = form["password"][0]
        password_from_data = users.getPassword(login)
        if password_from_data != None:
            user = users.login(login, password_from_data[1])
            if bcrypt.checkpw(password.encode(), password_from_data[1]) == False:

                return self.json_response({"status": "Fail"})
            else:
                user_rights = users.getRights(login)[1]
                self.principal = Principal(id=str(user[0]), roles=[user_rights, ])

                return self.json_response({"status": "ok"})
        else:
            return self.json_response({"status": "Fail"})
        
    def get(self):
        return self.render_response("log_home.html")


class SnakeHandler(BaseHandler):
    @authorize()
    def get(self):
        user_id = self.principal.id
        users = Users()
        login = users.loginName(user_id)[1]
        score = users.scoreAmount(login)[1]
        login = login\
            .replace("<", "&lt;")\
            .replace(">", "&gt;")\
            .replace('"', "&quot;")\
            .replace("'", "&#39;")

        return self.render_response("snake.html", login=login, score=score)


class ScoreHandler(BaseHandler):
    def post(self):
        highscore = int(self.request.form["highscore"][0])
        user_id = self.principal.id
        score = int(self.request.form["score"][0])
        date = datetime.now().strftime("%d/%m/%Y")
        time = datetime.now().strftime("%H:%M")
        users = Users()
        users.scoreInsert(str(user_id),score,date,time)
        users.highScoreUpdate(highscore, user_id)


class ScoreSendHandler(BaseHandler):
        def post(self):
            users = Users()
            user_id = self.principal.id
            stats = users.getStats(str(user_id))
            return self.json_response({"body": stats})
        

class LeaderBoardSendHandler(BaseHandler):
    def post(self):
        users = Users()
        stats = users.sortHighScores()
        return self.json_response({"body": stats})


class LogoutHandler(BaseHandler):
    def get(self):
        del self.principal

        return self.redirect_for('home')
    

class LeaderBoardHandler(BaseHandler):
    def post(self):
        Users().test()

    def get(self):
        return self.render_response("leaderboard.html")


class MyScoresHandler(BaseHandler):
    @authorize()
    def get(self):
        return self.render_response("scores.html")


class GamesDashboardHandler(BaseHandler):
    def get(self):
        user_id = self.principal.id
        users = Users()
        login = users.loginName(user_id)[1]
        score = users.scoreAmount(login)[1]
        login = login\
            .replace("<", "&lt;")\
            .replace(">", "&gt;")\
            .replace('"', "&quot;")\
            .replace("'", "&#39;")
        return self.render_response("game_dashboard.html", login=login)
    

class JsonValidationHandler(BaseHandler):
    @authorize(roles=["admin","super","admin gamer"])
    def get(self):
        return self.render_response("json_val.html")
    

class RunScriptHandler(BaseHandler):
    def post(self):
        data = json.loads(self.request.form["file"][0])
        f = open("temp/temp.json","w")
        json.dump(data, f, indent=6)
        f.close()
    

class ErrorListHandler(BaseHandler):
#################################             NEW             ######################################

#### IN json_validation.py DELETE ALL "\n"

    def get(self):
        return self.render_response("error_list.html")

class GetErrorHandler(BaseHandler):
    def post(self):
        users = Users()
        user_id = self.principal.id
        fixed = 0
        error_list = validation_func("temp/temp.json")
        for i in range(len(users.getError(user_id))):
            if users.getError(user_id)[i][0] not in error_list:
                fixed = 1
                users.updateErrors(user_id, users.getError(user_id)[i][0], fixed)
            if int(users.getError(user_id)[i][1]) == 1 and users.getError(user_id)[i][0] in error_list:
                fixed = 0
                users.updateErrors(user_id, users.getError(user_id)[i][0], fixed)

        for error in error_list:
            users.insertErrors(user_id, error, fixed)

        return self.json_response({"errors": users.getError(user_id)})
#################################             NEW             ######################################
    

        

class ChangeRightsHandler(BaseHandler):
    @authorize(roles=["super",])
    def get(self):
        users = Users()
        rights = users.getAllRights()
        requests = users.getAllRequests()
        user_id = self.principal.id
        login = users.loginName(user_id)[1]
        right = []
        for i in range(len(rights)):
            right_list = list(rights[i])
            if " " in rights[i][1]:
                double_rights = rights[i][1].split(" ")
                # rights[i][1] = double_rights
                right_list[1] = double_rights
            right.append(right_list)
        return self.render_response("change_rights.html", right=right, login=login, requests=requests)


class SendRolesHandler(BaseHandler):
    def post(self):
        users = Users()
        rights = users.getAllRights()
        requests = users.getAllRequests()
        user_id = self.principal.id
        login = users.loginName(user_id)[1]
        right = []
        for i in range(len(rights)):
            right_list = list(rights[i])
            if " " in rights[i][1]:
                double_rights = rights[i][1].split(" ")
                # rights[i][1] = double_rights
                right_list[1] = double_rights
            right.append(right_list)
        return self.json_response({"roles":right,"login":login,"requests":requests})
        

class PostNewHandler(BaseHandler):
    def post(self):
        form = self.request.form
        users = Users()
        for login in form:
            if 'null' in form[login]:
                users.setNull(login)
            roles_list = form[login][0].split(",")
            if len(roles_list) == 2:
                roles = f"{roles_list[0]} {roles_list[1]}"
                users.changeRoles(login, roles)
            else:
                users.changeRoles(login, roles_list[0])

        return self.json_response({"status":"ok"})


###########################################################################################
class RequestHandler(BaseHandler):
    def get(self):
        user_id = self.principal.id
        users = Users()
        login = users.loginName(user_id)[1]
        rights = users.getRights(login)
        print(rights[1])
        return self.render_response("requests.html", login=login, role = rights[1])

class SubmitRequestHandler(BaseHandler):
    def post(self):
        form = self.request.form
        req = form.get("request")
        users = Users()
        user_id = self.principal.id
        login = users.loginName(user_id)[1]
        if self.principal.roles[0] == req[0]:
            return self.json_response(
                {
                    "status":"fail",
                    "message": f"You are already {self.principal.roles[0]}"
                })
        else:
            users.postRequests(login,req[0])
            return self.json_response(
                {
                    "status":"ok",
                    "message": f"Your request is sent to super"
                })




