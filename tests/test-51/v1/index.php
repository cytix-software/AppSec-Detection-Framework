<?php
// Vulnerable to CWE-651: Exposure of WSDL File Containing Sensitive Information
// This application exposes a WSDL file that contains sensitive information about the service

// Set content type to XML
header('Content-Type: application/xml');

// WSDL file containing sensitive information
$wsdl = <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<definitions name="UserService"
    targetNamespace="http://example.com/UserService"
    xmlns="http://schemas.xmlsoap.org/wsdl/"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
    xmlns:tns="http://example.com/UserService"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema">

    <!-- Sensitive information exposed in WSDL -->
    <types>
        <xsd:schema targetNamespace="http://example.com/UserService">
            <xsd:element name="UserCredentials">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element name="apiKey" type="xsd:string" default="FAKE_API_KEY_1234567890"/>
                        <xsd:element name="internalEndpoint" type="xsd:string" default="https://internal-api.company.com/v1"/>
                        <xsd:element name="databaseConnection" type="xsd:string" default="postgresql://admin:FAKE_PASSWORD@db.company.com:5432/production"/>
                        <xsd:element name="adminCredentials">
                            <xsd:complexType>
                                <xsd:sequence>
                                    <xsd:element name="username" type="xsd:string" default="admin@company.com"/>
                                    <xsd:element name="password" type="xsd:string" default="FAKE_PASSWORD_123!"/>
                                </xsd:sequence>
                            </xsd:complexType>
                        </xsd:element>
                        <xsd:element name="securityConfig">
                            <xsd:complexType>
                                <xsd:sequence>
                                    <xsd:element name="encryptionKey" type="xsd:string" default="FAKE_ENCRYPTION_KEY_1234567890"/>
                                    <xsd:element name="jwtSecret" type="xsd:string" default="FAKE_JWT_SECRET_1234567890"/>
                                    <xsd:element name="internalApiToken" type="xsd:string" default="FAKE_API_TOKEN_1234567890"/>
                                </xsd:sequence>
                            </xsd:complexType>
                        </xsd:element>
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
        </xsd:schema>
    </types>

    <!-- Service definition exposing internal endpoints -->
    <message name="GetUserRequest">
        <part name="parameters" element="tns:UserCredentials"/>
    </message>

    <portType name="UserServicePortType">
        <operation name="getUser">
            <input message="tns:GetUserRequest"/>
        </operation>
    </portType>

    <!-- Binding information exposing internal implementation details -->
    <binding name="UserServiceBinding" type="tns:UserServicePortType">
        <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
        <operation name="getUser">
            <soap:operation soapAction="http://example.com/UserService/getUser"/>
            <input>
                <soap:body use="literal"/>
            </input>
        </operation>
    </binding>

    <!-- Service endpoint exposing internal server details -->
    <service name="UserService">
        <port name="UserServicePort" binding="tns:UserServiceBinding">
            <soap:address location="http://internal-server.company.com:8080/UserService"/>
            <soap:address location="http://admin-server.company.com:8081/AdminService"/>
            <soap:address location="http://database-server.company.com:5432/DBService"/>
        </port>
    </service>
</definitions>
XML;

// Output the WSDL file
echo $wsdl;
?> 