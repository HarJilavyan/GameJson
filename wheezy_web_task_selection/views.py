import json
import bcrypt
from datetime import datetime
from wheezy.web import authorize
from wheezy.security import Principal
from wheezy.web.handlers import BaseHandler

from roles import roles
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
            rights = users.getRights(login)[1].strip(
                "[]").replace("'", "").split(", ")

            login = login\
                .replace("<", "&lt;")\
                .replace(">", "&gt;")\
                .replace('"', "&quot;")\
                .replace("'", "&#39;")

            return self.render_response(
                "requests.html", 
                login=login,
                rights=rights,
                roles=roles
            )

        else:
            user_id = self.principal.id
            user_rights = [self.principal.roles][0]
            if " " in user_rights[0]:
                user_rights = user_rights[0].split(" ")
            users = Users()
            login = users.loginName(user_id)[1]
            login = login\
                .replace("<", "&lt;")\
                .replace(">", "&gt;")\
                .replace('"', "&quot;")\
                .replace("'", "&#39;")
            return self.render_response("log_home.html", login=login, user_rights=user_rights, all_roles=roles)


class RegisterHandler(BaseHandler):
    def get(self):
        if self.principal != None:
            if self.principal.roles != "":
                user_id = self.principal.id
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
        form = self.request.form
        users = Users()
        new_user_name = form['login'][0]
        new_user_password = form['password'][0]

        if new_user_password != form['verify'][0]:
            return self.json_response(
                {
                    "status": "Fail",
                    "message": "Passwords dont match",
                    "field": "verify"
                }
            )
        if users.check_username(new_user_name):
            return self.json_response(
                {
                    "status": "Fail",
                    "message": "Login exists",
                    "field": "login"
                }
            )
        hashed_password = bcrypt.hashpw(
            new_user_password.encode(), bcrypt.gensalt())
        users.sign_up(new_user_name, hashed_password, "['']")
        user = users.login(new_user_name, hashed_password)
        self.principal = Principal(id=str(user[0]), roles=["",])

        return self.json_response({"status": "ok"})


class LoginUserHandler(BaseHandler):
    def post(self):
        form = self.request.form
        users = Users()
        login = form["login"][0]
        password = form["password"][0]
        roles = ''
        password_from_data = users.getPassword(login)

        if password_from_data:
            user = users.login(login, password_from_data[1])

            if bcrypt.checkpw(password.encode(), password_from_data[1]) == False:

                return self.json_response({"status": "Fail"})
            else:
                user_rights = users.getRights(login)[1].strip(
                    '[]').replace("'", "").split(", ")
                for i in range(len(user_rights)):
                    roles += f"{user_rights[i]};"
                    self.principal = Principal(
                        id=str(user[0]), roles=[roles, ])

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
        stats = users.sortHighScores()
        login = users.loginName(user_id)[1]
        score = users.scoreAmount(login)[1]
        login = login\
            .replace("<", "&lt;")\
            .replace(">", "&gt;")\
            .replace('"', "&quot;")\
            .replace("'", "&#39;")

        return self.render_response("snake.html", login=login, score=score, stats=stats)


class ScoreHandler(BaseHandler):
    def post(self):
        highscore = int(self.request.form["highscore"][0])
        user_id = self.principal.id
        score = int(self.request.form["score"][0])
        date = datetime.now().strftime("%d/%m/%Y")
        time = datetime.now().strftime("%H:%M")
        users = Users()
        users.scoreInsert(str(user_id), score, date, time)
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
        login = login\
            .replace("<", "&lt;")\
            .replace(">", "&gt;")\
            .replace('"', "&quot;")\
            .replace("'", "&#39;")
        return self.render_response("game_dashboard.html", login=login)


class JsonValidationHandler(BaseHandler):
    @authorize(roles=("admin", "super"))
    def get(self):
        return self.render_response("json_val.html")


class RunScriptHandler(BaseHandler):
    def post(self):
        data = json.loads(self.request.form["file"][0])
        f = open("temp/temp.json", "w")
        json.dump(data, f, indent=6)
        f.close()


class ErrorListHandler(BaseHandler):
    def get(self):
        return self.render_response("error_list.html")


class GetErrorHandler(BaseHandler):
    def post(self):
        users = Users()
        user_id = self.principal.id
        fixed = 0
        error_list = validation_func("temp/temp.json")
        user_data = users.getError(user_id)

        for user in user_data:
            if user[0] not in error_list:
                fixed = 1
                users.updateErrors(user_id, user[0], fixed)

            if int(user[1]) == 1 and user[0] in error_list:
                fixed = 0
                users.updateErrors(user_id, user[0], fixed)

        for error in error_list:
            users.insertErrors(user_id, error, fixed)

        return self.json_response({"errors": user_data})


class ChangeRightsHandler(BaseHandler):
    @authorize(roles=["super",])
    def get(self):
        users = Users()
        rights = users.getAllRights()
        requests = users.getAllRequests()
        user_id = self.principal.id
        login = users.loginName(user_id)[1]
        requests_list = []
        right = []

        for i in range(len(requests)):
            requests_list.append(list(requests[i]))
            if requests[i][0] != None:
                if "," in requests[i][0]:
                    more_requests = requests[i][0].split(", ")
                    requests_list[i] = more_requests

        for i in range(len(rights)):
            right_list = list(rights[i])
            right_list[1] = rights[i][1].strip(
                '[]').replace("'", "").split(", ")
            right.append(right_list)

        return self.render_response("change_rights.html", right=right, login=login, requests=requests_list, roles=roles)


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
            if "," in rights[i][1]:
                double_rights = rights[i][1].split(",")
                right_list[1] = double_rights
            right.append(right_list)

        return self.json_response({"roles": right, "login": login, "requests": requests})


class PostNewHandler(BaseHandler):
    def post(self):
        form = self.request.form
        users = Users()
        for htmllogin in form:
            login = htmllogin\
                .replace("&lt;", "<")\
                .replace("&gt;", ">")\
                .replace("&quot;", '"')\
                .replace("&#39;", "'")\
                .replace("%22", '"')
            roles = f"{form[htmllogin]}"
            users.changeRoles(login, roles)

        return self.json_response({"status": "ok"})


class RequestDelete(BaseHandler):
    def post(self):
        form = self.request.form
        users = Users()
        for htmllogin in form:
            login = htmllogin\
                .replace("&lt;", "<")\
                .replace("&gt;", ">")\
                .replace("&quot;", '"')\
                .replace("&#39;", "'")\
                .replace("%22", '"')
            old_req = users.getReq(login)[0].split(", ")
            for i in form[htmllogin]:
                if i in old_req:
                    old_req.remove(i)
                    if len(old_req) == 0:
                        users.setNull(login=login)
                    else:
                        users.postRequests(
                            login=login, request="".join(old_req))

        return self.json_response({"status": "ok"})


class RequestHandler(BaseHandler):
    def get(self):
        user_id = self.principal.id
        users = Users()
        login = users.loginName(user_id)[1]
        rights = users.getRights(login)[1].strip(
            "[]").replace("'", "").split(", ")
        login = login\
            .replace("<", "&lt;")\
            .replace(">", "&gt;")\
            .replace('"', "&quot;")\
            .replace("'", "&#39;")
        return self.render_response("requests.html", login=login, rights=rights, roles=roles)


class SubmitRequestHandler(BaseHandler):
    def post(self):
        form = self.request.form
        req = form.get("request")
        users = Users()
        user_id = self.principal.id
        login = users.loginName(user_id)[1]
        users.postRequests(login, str(req).strip("[]").replace("'", ""))
        return self.json_response(
            {
                "status": "ok",
                "message": f"Your request is sent to super"
            })
