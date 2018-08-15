import sys
from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from app import app

if __name__ == "__main__":
    print("服务器启动!!!!!")
    server = HTTPServer(WSGIContainer(app))
    server.listen(5000)
    IOLoop.instance().start()