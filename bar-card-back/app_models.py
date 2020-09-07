from mongoengine import Document, EmbeddedDocument, EmbeddedDocumentField, StringField, IntField, ReferenceField, \
    ListField, DateTimeField, BooleanField


class User(Document):
    name = StringField(required=True, max_length=50)
    surname = StringField(required=True, max_length=50)
    login = StringField(required=True)
    password = StringField(required=True)
    admin = BooleanField(required=True)
    email = StringField()


class Operation(EmbeddedDocument):
    balance = IntField()
    value = IntField()
    description = StringField(required=True)
    datetime = DateTimeField(required=True)
    comment = StringField()
    user = ReferenceField(User)
    username = StringField()


class Client(Document):
    name = StringField(required=True, max_length=50)
    surname = StringField(required=True, max_length=50)
    phone = StringField(max_length=12)
    status = StringField()
    card = StringField()
    balance = IntField()
    history = ListField(EmbeddedDocumentField(Operation))
    note = StringField()
