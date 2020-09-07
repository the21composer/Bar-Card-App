import uuid
from datetime import datetime
import json
import webbrowser
import os
import hashlib

from flask import Flask, render_template, request, jsonify, session
from mongoengine import connect
from app_models import Client, Operation, User

SECRET_KEY = str(uuid.uuid4())
app = Flask(__name__)
app.secret_key = SECRET_KEY
app.config['UPLOAD_FOLDER'] = '../data/'

connect("bar-card")
webbrowser.open('http://localhost:5000')


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        return render_template("/index.html")


def check_auth():
    return session.get("user") is not None


def check_admin():
    return session.get("user") is not None and session.get("admin")


@app.route('/auth', methods=['GET'])
def auth():
    user = session.get("user")
    admin = session.get("admin")
    if user:
        info = User.objects(login=user).first()
        return jsonify({
            'auth': user is not None,
            'admin': admin,
            'name': info.name,
            'surname': info.surname,
            'email': info.email
        })
    else:
        return jsonify({
            'auth': None
        })


@app.route('/sign/out', methods=['POST'])
def sign_out():
    session.pop('user', None)
    session.pop('admin', None)
    return jsonify({'success': True})


@app.route('/sign/in', methods=['POST'])
def sign_in():
    data_dict = request.get_json()
    user = User.objects(login=data_dict.get("login"),
                        password=hashlib.md5(bytes(data_dict.get("password"), 'utf-8')).hexdigest()).first()
    if not user:
        return jsonify({
            'success': False,
            'error': "Неверный логин или пароль"
        })
    else:
        session['user'] = user.login
        session['admin'] = user.admin
    return jsonify({'success': True})


@app.route('/sign/up', methods=['POST'])
def sign_up():
    data_dict = request.get_json()
    if data_dict.get("password1") == data_dict.get("password2"):
        try:
            for user in User.objects():
                if user.login == data_dict.get("login"):
                    return jsonify({'message': "При создании аккаунта возникла ошибка: данный логин занят"})
            User(name=data_dict.get("name"), surname=data_dict.get("surname"), email=data_dict.get("email"),
                 password=hashlib.md5(bytes(data_dict.get("password1"), 'utf-8')).hexdigest(),
                 login=data_dict.get("login"), admin=False).save()
        except Exception:
            return jsonify({'message': "При создании аккаунта возникла ошибка"})
        return jsonify({'message': "Аккаунт успешно создан"})
    return jsonify({'message': "При создании аккаунта возникла ошибка: пароли не совпадают"})


@app.route('/db/edit', methods=['POST'])
def db_edit():
    if not check_auth():
        return jsonify({
            'success': False,
            'error': 'Вы не имеете прав доступа к операции'
        })
    data_dict = request.get_json()
    data = data_dict.get("data")
    print(data)
    task = data_dict.get("task")
    if task == "ADD_RECORD":
        balance = data.get("balance")
        status = data.get("status")
        if status == "" or not status or (status != "В баре" and status != "Забрал сертификаты" and status != "Вышел"):
            status = "В баре"
        if not balance:
            balance = 0
        Client(name=data.get("name"), surname=data.get("surname"), card=data.get("card_number"),
               phone=data.get("phone_number"), balance=balance, status=status, note=data.get("note")).save()
        return jsonify({'success': True})
    elif task == "EDIT_RECORD":
        user = Client.objects(id=data.get("id")).first()
        if not user:
            return jsonify({
                'success': False,
                'error': 'Пользователь не был найден'
            })
        user.name = data.get("name")
        user.surname = data.get("surname")
        user.phone = data.get("phone_number")
        user.card = data.get("card_number")
        user.balance = data.get("balance")
        status = data.get("status")
        if status == "" or not status or (status != "В баре" and status != "Забрал сертификаты" and status != "Вышел"):
            status = "В баре"
        user.status = status
        user.note = data.get("note")
        user.save()
        return jsonify({'success': True})
    elif task == "DELETE_RECORD":
        user = Client.objects(id=data.get("id")).first()
        if not user:
            return jsonify({
                'success': False,
                'error': 'Пользователь не был найден'
            })
        user.delete()
        return jsonify({'success': True})


@app.route('/card_action', methods=['POST'])
def card_action():
    if not check_auth():
        return jsonify({
            'success': False,
            'error': 'Вы не имеете прав доступа к операции'
        })
    data_dict = request.get_json()
    print(data_dict)
    user = Client.objects(id=data_dict.get("id")).first()
    if not user:
        return jsonify({
            'success': False,
            'error': 'Пользователь не был найден'
        })
    if data_dict.get("amount") == "" or int(data_dict.get("amount")) == 0 or int(data_dict.get("amount")) < 0:
        return jsonify({
            'success': False,
            'error': 'Что-то не так с суммой'
        })
    if data_dict.get("event") == "drop":
        if int(data_dict.get("amount")) > user.balance:
            return jsonify({
                'success': False,
                'error': 'Сумма, которую Вы пытаетесь снять, больше баланса карты'
            })
        author = User.objects(login=session.get("user")).first()
        op = Operation(description="Снятие с карты", value=int(data_dict.get("amount")) * -1, datetime=datetime.now(),
                       comment=data_dict.get("comment"), user=author, username=author.name + " " + author.surname)
        user.history.append(op)
        user.balance -= int(data_dict.get("amount"))
    else:
        comment = data_dict.get("comment")
        if data_dict.get("return"):
            comment = "Возврат сертификатов\n" + data_dict.get("comment")
        author = User.objects(login=session.get("user")).first()
        op = Operation(description="Зачисление на карту", value=int(data_dict.get("amount")), datetime=datetime.now(),
                       comment=comment, user=author, username=author.name + " " + author.surname)
        user.history.append(op)
        user.balance += int(data_dict.get("amount"))
    user.save()
    return jsonify({'success': True})


@app.route('/update_status', methods=['POST'])
def update_status():
    if not check_auth():
        return jsonify({
            'success': False,
            'error': 'Вы не имеете прав доступа к операции'
        })
    data_dict = request.get_json()
    print(data_dict)
    user = Client.objects(id=data_dict.get("id")).first()
    if not user:
        return jsonify({
            'success': False,
            'error': 'Пользователь не был найден'
        })
    user.status = data_dict.get("status")
    author = User.objects(login=session.get("user")).first()
    op = Operation(description="Изменен статус: " + data_dict.get("status"), datetime=datetime.now(),
                   comment=data_dict.get("comment"), user=author, username=author.name + " " + author.surname)
    user.history.append(op)
    user.save()
    return jsonify({'success': True})


@app.route('/update_note', methods=['POST'])
def update_note():
    if not check_auth():
        return jsonify({
            'success': False,
            'error': 'Вы не имеете прав доступа к операции'
        })
    data_dict = request.get_json()
    print(data_dict)
    user = Client.objects(id=data_dict.get("id")).first()
    if not user:
        return jsonify({
            'success': False,
            'error': 'Пользователь не был найден'
        })
    user.note = data_dict.get("note")
    user.save()
    return jsonify({'success': True})


@app.route('/db/get', methods=['POST'])
def db_get():
    if not check_auth():
        return jsonify({
            'success': False,
            'error': 'Вы не имеете прав доступа к операции'
        })
    data_dict = request.get_json()
    print(data_dict)
    columns = [
        {
            'title': 'Имя',
            'field': 'name'
        },
        {
            'title': 'Фамилия',
            'field': 'surname',
        },
        {
            'title': 'Контакты',
            'field': 'phone_number',
        },
        {
            'title': 'Номер карты',
            'field': 'card_number',
        },
        {
            'title': 'Баланс',
            'field': 'balance',
        },
        {
            'title': 'Статус',
            'field': 'status',
        },
        {
            'title': 'Примечание',
            'field': 'note',
        },
    ]

    data = []
    for user in Client.objects():
        if not data_dict.get("content") or user.status == "В баре":
            data.append(
                {
                    'name': user.name,
                    'surname': user.surname,
                    'phone_number': user.phone,
                    'card_number': user.card,
                    'balance': user.balance,
                    'status': user.status,
                    'note': user.note,
                    'id': str(user.id)
                }
            )
    output = {
        'success': 'true',
        'table': {
            'columns': columns,
            'data': data
        }
    }
    return jsonify(output)


@app.route('/db/history', methods=['POST'])
def db_history():
    if not check_auth():
        return jsonify({
            'success': False,
            'error': 'Вы не имеете прав доступа к операции'
        })
    data_dict = request.get_json()
    print(data_dict)
    user = Client.objects(id=data_dict.get("id")).first()
    columns = [
        {
            'title': 'Дата',
            'field': 'datetime'
        },
        {
            'title': 'Описание',
            'field': 'description',
        },
        {
            'title': 'Значение',
            'field': 'value',
        },
        {
            'title': 'Комментарий',
            'field': 'comment'
        },
        {
            'title': 'Пользователь',
            'field': 'user'
        },
        {
            'title': 'Логин',
            'field': 'login'
        }
    ]

    data = []
    for op in user.history:
        if not op.user:
            login = None
        else:
            login = op.user.login
        data.append(
            {
                'description': op.description,
                'value': op.value,
                'datetime': datetime.strftime(op.datetime, "%d.%m.%Y %H:%M:%S"),
                'date': op.datetime,
                'comment': op.comment,
                'user': op.username,
                'login': login
            }
        )
    data = sorted(data, key=lambda x: x['date'], reverse=True)
    output = {
        'success': 'true',
        'table': {
            'columns': columns,
            'data': data
        }
    }
    return jsonify(output)


@app.route('/db/download', methods=['GET'])
def db_download():
    if not check_auth():
        return jsonify({
            'success': False,
            'error': 'Вы не имеете прав доступа к операции'
        })
    users = json.loads(Client.objects.to_json())
    return json.dumps(users, indent=2)


@app.route('/db/import', methods=['POST'])
def db_import():
    if not check_auth():
        return jsonify({
            'success': False,
            'error': 'Вы не имеете прав доступа к операции'
        })
    target = os.path.join(app.config['UPLOAD_FOLDER'])
    file = request.files['file']
    save_data = request.form['save']
    print(save_data)
    filename = "backup.json"
    destination = "".join([target, filename])
    file.save(destination)
    try:
        json_file = open(destination, encoding="utf-8")
        data = json.load(json_file)
        if save_data == 'false':
            for user in Client.objects():
                user.delete()
        for user in data:
            new_user = Client(name=user.get("name"), surname=user.get("surname"), phone=user.get("phone"),
                              card=user.get("card"),
                              balance=user.get("balance"), status=user.get("status"), note=user.get("note"))
            for op in user.get("history"):
                operation = Operation.from_json(json.dumps(op))
                new_user.history.append(operation)
            new_user.save()
    except Exception as error:
        print(error)
        return jsonify({
            'success': False,
            'error': 'Ошибка при загрузки бэкапа данных. Текущие данные были сохранены'
        })

    return jsonify({
        'success': True
    })


@app.route('/users/get', methods=['POST'])
def users_get():
    if not check_admin():
        return jsonify({
            'success': False,
            'error': 'Вы не имеете прав доступа к операции'
        })
    columns = [
        {
            'title': 'Имя',
            'field': 'name'
        },
        {
            'title': 'Фамилия',
            'field': 'surname',
        },
        {
            'title': 'Почта',
            'field': 'email',
        },
        {
            'title': 'Логин',
            'field': 'login',
        },
        {
            'title': 'Администратор',
            'field': 'admin',
        },
    ]

    data = []
    for user in User.objects():
        if user.admin:
            admin = "Да"
        else:
            admin = "Нет"
        data.append(
            {
                'name': user.name,
                'surname': user.surname,
                'email': user.email,
                'login': user.login,
                'admin': admin,
                'id': str(user.id)
            }
        )
    output = {
        'success': 'true',
        'table': {
            'columns': columns,
            'data': data
        }
    }
    return jsonify(output)


@app.route('/users/edit', methods=['POST'])
def users_edit():
    if not check_admin():
        return jsonify({
            'success': False,
            'error': 'Вы не имеете прав доступа к операции'
        })
    data_dict = request.get_json()
    data = data_dict.get("data")
    print(data)
    task = data_dict.get("task")
    if task == "DELETE_RECORD":
        user = User.objects(id=data.get("id")).first()
        if not user:
            return jsonify({
                'success': False,
                'error': 'Пользователь не был найден'
            })
        user.delete()
        return jsonify({'success': True})


@app.route('/update_admin', methods=['POST'])
def update_admin():
    if not check_admin():
        return jsonify({
            'success': False,
            'error': 'Вы не имеете прав доступа к операции'
        })
    data_dict = request.get_json()
    print(data_dict)
    user = User.objects(id=data_dict.get("id")).first()
    if not user:
        return jsonify({
            'success': False,
            'error': 'Пользователь не был найден'
        })
    if data_dict.get("status") == "Нет":
        user.admin = False
    else:
        user.admin = True
    user.save()
    return jsonify({'success': True})


def main():
    webbrowser.open('http://localhost:5000')
    app.run()


if __name__ == '__main__':
    app.run()
