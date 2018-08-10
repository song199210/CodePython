import sys
from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from run import manager

http_server = HTTPServer(WSGIContainer(manager.run())) #加入容器
IOLoop.instance().start()