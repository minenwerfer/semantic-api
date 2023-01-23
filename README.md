# semantic-api
> The pure REST framework

## Introduction

semantic-api is a **REST framework** that aims to create resource-driven, fully-compliant REST APIs while enforcing a boilerplate-free and clean architecture. It has out of the box Typescript integration, allowing you use consistent static typing in both backend and frontend.

## Why

The following is an excerpt from O'Reilly's book [RESTful Web Services](https://www.oreilly.com/library/view/restful-web-services/9780596529260/ch04.html):

>A resource is anything that's important enough to be referenced as a thing in itself. If your users might "want to create a hyperlink to it, make or refute assertions about it, retrieve or cache a representation of it, include all or part of it by reference into another representation, anotate it, or perform other operations on it", then you should make it a resource. […] A resource may be a physical object like an apple, or an abstract concept like courage […]

In semantic-api the "physical objects" are referred as "collections" and are always things that are stored on databases, and the "abstract concepts" are groups of endpoints that execute logic on a certain context.

## Out of the box features

- User management, logging, file management
- Comprehensive access control
- Rate limiting for throttling and paid usage
- Runtime payload validation
- User messaging system

## Getting started

- [Official documentation](https://semantic-api.github.io/semantic-api/)
- [Examples](https://github.com/ringeringeraja/semantic-api/tree/master/examples)
