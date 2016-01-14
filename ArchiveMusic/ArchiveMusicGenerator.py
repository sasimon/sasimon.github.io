import os
import os.path
import posixpath
from bs4 import BeautifulSoup, Tag, NavigableString, Comment
document = """
<!DOCTYPE html>
<html>
    <head>
        <title>Stuart Simon's Archive Music Application</title>
        <meta charset="utf-8" />
        <!-- add one of the jQWidgets styles -->
        <link rel="stylesheet" 
        href="jqwidgets/styles/jqx.base.css" type="text/css" />
        <!-- Theme styles -->
        <!-- add the jQuery script -->
        <script type="text/javascript" src="scripts/jquery-2.0.3.min.js"></script>
        <!-- add the jQWidgets framework -->
        <script type="text/javascript" src="jqwidgets/jqxcore.js"></script>
        <!-- add one or more widgets -->
    </head>
    <body>
        <div id="databaseControl">
            <div>Loading database, please wait...</div>
            <div></div>
        </div>
        <script src="ArchiveMusic.js"></script>
    </body>
</html>
"""
docSoup = BeautifulSoup(document,"html.parser")
styleIndex = 0
while not (isinstance(docSoup.find("head").contents[styleIndex], Comment) and docSoup.find("head").contents[styleIndex].string == " Theme styles "):
    styleIndex += 1
for stylesheet in os.listdir("jqwidgets/styles"):
    stylesheetFull = os.path.abspath("jqwidgets/styles/" + stylesheet)
    isFile = os.path.isfile(stylesheetFull)
    basename = posixpath.basename(stylesheetFull)
    if (os.path.isfile(stylesheetFull) and posixpath.basename(stylesheetFull) != "jqx.base.css"):
        styleIndex += 1
        linkTag = docSoup.new_tag("link")
        linkTag["rel"] = "stylesheet"
        linkTag["type"] = "text/css"
        linkTag["href"] = "jqwidgets/styles/" + os.path.basename(stylesheet)
        docSoup.find("head").insert(styleIndex, linkTag)
for script in os.listdir("jqwidgets"):
    scriptFull = "jqwidgets/" + script
    isFile = os.path.isfile(scriptFull)
    basename = posixpath.basename(scriptFull)
    if (isFile and basename != "jqx-all.js"and basename != "jqxcore.js"):
        scriptTag = docSoup.new_tag("script",type="text/javascript",src=scriptFull)
        docSoup.find("head").append(scriptTag)
docFile = open("index.html","w")
docFile.write(docSoup.prettify())
docFile.close()

