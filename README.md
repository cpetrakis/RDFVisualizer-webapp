# RDFVisualizer-webapp

### 1. Description ###

RDF Visualizer is a tool for displaying and browsing high density of RDF data. This tool is a generic browsing mechanism that gives the user a flexible, highly configurable, detailed overview of an RDF dataset/database, designed and developed to overcome the drawbacks of the existing RDF data visualization methods/tools.

RDF Visualizer supports browsing content from:
1. [Virtuoso](https://virtuoso.openlinksw.com) database.
2. [Blazegraph](https://www.blazegraph.com) database. 
3. Simple file (Has been tested with .ttl files).

Further information about the tool functionalities can be found [here.](http://www.cidoc-crm.org/sites/default/files/RDF%20visualiser.pdf)

### 2. Installation ###

3 Simple Steps: Build - Deploy - Run.

The folder src contains all the files needed to build the web app and create a war file.

This project is a Maven project, providing all the libs in pom.xml. 

You may use any application server that supports war files (recommended: Apache Tomcat version 7 and above).

After deployment you will be able to access the following screen in address: [URL]:[PORT]/RDFVisualizer

Below you can see the first screen of the tool.

![Alt text](/src/main/webapp/img/firstscreen.png?raw=true "First Screen")


### 3. Configuration ###

You may configure the tool providing your preferences in configuration file (config.properties) 
which is found in [RDF-Visualizer-webapp/src/webbapp/WEB- INF/classes/config.properties].

First of all, the tool can read and visualize data from virtuoso database, from blazegraph database or direct from .ttl files. 

User can define this source location by editing the ‘database’ property value as below:

```properties

# database value can be 'file' 'virtuoso' or 'blazegraph'

# 'file' reads direct from file
# 'virtuoso' reads from a virtuoso endpoint
# 'blazegraph' reads from a blazegraph endpoint

database = virtuoso

```

#### Virtuoso Case ####

If property ‘database’ has value ‘virtuoso’ then the following values must be filled as below:

```properties

############################ VIRTUOSO ################################## 

# in case of 'virtuoso' insert values, else leave them blank
db_username = virtuoso username [default = dba ]
db_password = virtuoso password [default = dba ]
db_port = virtuoso port     [default = 1111]
db_url = virtuoso url [default= jdbc\:virtuoso\://localhost]
db_graphname = graphname [e.g. http://localhost:8890/GRAPH_NAME]

```

#### Blazegraph Case ####

If property ‘database’ has value ‘blazegraph’ then following values must be filled as below

```properties

############################ BLAZEGRAPH ################################
# in case of 'blazegraph' insert values else leave blank

blazegraph_url = blazegraph url [e.g. http://localhost:9999/blazegraph]

```

#### File Case ####

If property ‘database’ has value ‘file’ then following values must be filled as below:

```properties

############################### FILE #################################### 

# in case of 'file' insert values, else leave blank
# If we know the path of the file we want to visualize then we fill it as # filename property value
# e.g C:\\Users\\cpetrakis\\Desktop\\bb\\b.ttl
# WARNING: if we want dynamically give the filename as parameter to the
# RDF Visualizer from another system we leave the property value blank !

filename =

# default_folder value defines the path of default server folder in which
# the rdf files are saved.
# If the database property value is ‘file’ we must fill this property value 
# in order the RDF Visualizer to find and visualize the files.

default_folder = [e.g. C:\\Users\\User\\Desktop\\My_Folder]

```

#### Other Visualization Configuration ####

User can configure other parameters in the visualization of a subject uri as described below :

```properties

####################### Configuration Uris #############################
# The tool is capable to show all properties of a given subject type with 
# specific order.
# To do that, properties.xml file location (properties_xml property value)
# must be defined below.

priorities_xml = [e.g. C:\\RDFVisualizer\\main\\resources\\properties.xml]

# tree depth
# WARNING: the value MUST be 0 in current version
# defines the preopened depth of every node in the tree

tree_depth = 0

# Images
# The tool handles as images the typical image file types (jpeg, gif & png) 
# User can also define an image type uri.

image_type_uri = [e.g. http://www.cidoc-crm.org/cidoc-crm/E38_Image] 

# define which prefixes will be replaced with with "*/"

prefix = [e.g. http://collection.britishmuseum.org/ ] 
imgprefix = [e.g. http://www.britishmuseum.org/collectionimages/ ]

# does not show children with core-prefLabel properties

pref_Label_uri = [e.g. http://www.w3.org/2004/02/skos/core#prefLabel ]

# define the type uri and does not show children with syntax-ns#type

type_Label_uri = [e.g. http://www.w3.org/1999/02/22-rdf-syntax-ns#type ]

# does not show children with rdf-schema#label properties

schema_Label_uri = [e.g. http://www.w3.org/2000/01/rdf-schema#label ]

##########################################################################

# Exclude properties uris from inverse properties 
# the given uris does not shown in the tree

exclude_inverse = [e.g.http://erlangen-crm.org/current/P45_consists_of , http://www.cidoc-crm.org/cidoc-crm/P42_assigned]

```

#### Properties prioritization ####
The tool is capable to show all properties of a given subject type with specific order. 
User can define properties order by editing the file: [\WEB-INF\classes\properties.xml] which has the following structure:

```xml

<xproperties>
    <virtuoso_host>vhost</virtuoso_host>
<!-- *********************************************************** -->
Properties order configuration
<!-- *********************************************************** -->
    <preference>
        <type_uri>
        SUBJECT TYPE URI
    Defines which subject’s type properties order will to be configured
        [e.g. http://www.cidoc-crm.org/cidoc-crm/E22_Man-Made_Object]
        </type_uri>
    <weighted_property>
         <property_uri>
         PROPERTY URI
    Defines which property is going to be configured.
       [e.g. http://www.cidoc-crm.org/cidoc-crm/P2_has_type]
        </property_uri>
        <property_weight>
        PROPERTY WEIGHT
    Defines the priority of the above property.
    The smaller given weight, the higher priority we have in visualization.
        [e.g. 110]
        </property_weight>
    </weighted_property>
    <weighted_property>
        <property_uri>
        [e.g. http://www.cidoc-crm.org/cidoc-crm/P102_has_title]
        </property_uri>
        <property_weight>
        [e.g. 130]
        </property_weight>
    </weighted_property>
    </preference>
<xproperties>

```

### 4. Usage ###

You can use this project by:

  1. Using directly the home page providing the subject uris you want to visualize as parameters.
  
  2. Calling the tool from any other system/webpage by producing urls like
     “[URL]: [PORT]/RDFVisualizer/?resource=[subjectURI]”
     
After the tool is online with all configuration done right, you can visualize your data with the following ways:

Either you can paste the uri you want to visualize in the form below and press enter.

![Alt text](/src/main/webapp/img/secondscreen.png?raw=true "Insert subject screen")

After that you can see a tree with incoming and outgoing links of this subject uri like the screen below:

![Alt text](/src/main/webapp/img/thirdscreen.png?raw=true "Final Screen")

The other way to use the tool is to pass the preferred subject uri as a parameter by creating and calling urls like:

[URL] : [PORT]/RDFVisualizer/?resource=[Subject URI]
e.g. http://localhost:8084/RDFVisualizer/?resource=http://www.oeaw.ac.at/COIN/6 

Also you can pass the filename as a parameter creating urls like:

[URL]: [port]/RDFVisualizer/?resource=[Subject URI]&filename=[Filename]
e.g. http://localhost:8084/RDFVisualizer/?resource=http://www.mybuildingsample.com/building/1&filename=Mapping864.ttl

Further documentation about the tool functionalities you can find [here](http://www.cidoc-crm.org/sites/default/files/RDF%20visualiser.pdf)

### 5. Contact ###

Petrakis Kostas < cpetrakis@ics.forth.gr >



