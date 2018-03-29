# tomcat

## tomcat是什么

> Tomcat 是由 Apache 开发的一个 Servlet 容器，实现了对 Servlet 和 JSP 的支持，并提供了作为Web服务器的一些特有功能，如Tomcat管理和控制平台、安全域管理和Tomcat阀等。
> 由于 Tomcat 本身也内含了一个 HTTP 服务器，它也可以被视作一个单独的 Web 服务器。但是，不能将 Tomcat 和 Apache HTTP 服务器混淆，Apache HTTP 服务器是一个用 C 语言实现的 HTTP Web 服务器；这两个 HTTP web server 不是捆绑在一起的。Tomcat 包含了一个配置管理工具，也可以通过编辑XML格式的配置文件来进行配置。

其实就是一个容器，里面塞java的包。类比可能就是php和apache的关系？node.js自己可以起一个http服务器，所以这里的容器的概念还是有点不太清楚。

## tomcat目录

* /bin - Tomcat 脚本存放目录（如启动、关闭脚本）。 *.sh 文件用于 Unix 系统； *.bat 文件用于 Windows 系统。
* /conf - Tomcat 配置文件目录。
* /logs - Tomcat 默认日志目录。
* /webapps - webapp 运行的目录。

## 安装以及环境变量

添加环境变量 CATALINA_HOME ，值为 Tomcat 的安装路径。

进入安装目录下的 bin 目录，运行 startup.bat 文件，启动 Tomcat

localhost:8080

## 配置

### Server

Server 元素表示整个 Catalina servlet 容器。

因此，它必须是 `conf/server.xml` 配置文件中的根元素。它的属性代表了整个 servlet 容器的特性。


| 属性      | 描述                                                                | 备注                                         |
| --------- | ------------------------------------------------------------------- | -------------------------------------------- |
| className | 这个类必须实现org.apache.catalina.Server接口。                      | 默认 org.apache.catalina.core.StandardServer |
| address   | 服务器等待关机命令的TCP / IP地址。如果没有指定地址，则使用localhost |                                              |
| port      | 服务器等待关机命令的TCP / IP端口号。设置为-1以禁用关闭端口。        |                                              |
| shutdown  | 必须通过TCP / IP连接接收到指定端口号的命令字符串，以关闭Tomcat。    |                                              |

### Service

Service元素表示一个或多个连接器组件的组合，这些组件共享一个用于处理传入请求的引擎组件。Server 中可以有多个 Service。