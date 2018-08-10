import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_script import Manager
from flask_migrate import MigrateCommand,Migrate
from flask_cors import CORS
from pymysql import install_as_MySQLdb
from logging import basicConfig

install_as_MySQLdb()

#实例化Flask创建全局实例
app=Flask(__name__)
app.config.from_object("config") #引入config.py配置文件
db=SQLAlchemy(app)  #初始化SQLAlchemy框架
mail=Mail(app) #初始化邮箱组件
manager=Manager(app)

migrate=Migrate(app,db)
manager.add_command("db",MigrateCommand)

path=os.path.dirname(__file__)#配置日志
file_name=os.path.join(path,"loggin.txt")
basicConfig(filename=file_name,format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

#解决跨域问题
CORS(app,support_credentials=True)

from app import views,models,mail