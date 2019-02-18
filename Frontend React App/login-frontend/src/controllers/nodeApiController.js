import React, {
    Component
} from 'react';
import axios from 'axios';

const domainName = "http://localhost:4000/"

export function register(userData) {
    return axios({
        method: 'post',
        url: domainName + "register",
        data: userData
    })
        .then(response => {
            return response
        })
        .catch(error => {
            return error.response
        })
}

export function sendVerifyMail(userData) {
    return axios({
        method: 'post',
        url: domainName + "verify",
        data: userData
    })
        .then(response => {
            return response
        })
        .catch(error => {
            return error.response
        })
}

export function sendResetMail(userData) {
    return axios({
        method: 'post',
        url: domainName + "forgot",
        data: userData
    })
        .then(response => {
            return response
        })
        .catch(error => {
            return error.response
        })
}

export function login(userData) {
    return axios({
        method: 'post',
        url: domainName + "login",
        data: userData
    })
        .then(response => {
            return response
        })
        .catch(error => {
            return error.response
        })
}

export function getAllUsers() {
    return axios({
        method: 'get',
        url: domainName + "/",
    })
}

export function getUser(id) {
    return axios({
        method: 'get',
        url: domainName + id,
    })
}

export function getAdminData() {
    return axios({
        method: 'get',
        url: domainName + "admin",
    })
        .then(response => {
            return response
        })
        .catch(error => {
            return error.response
        })
}

export function resetPassword(userData) {
    return axios({
        method: 'put',
        url: domainName + "forgot",
        data: userData
    })
        .then(response => {
            return response
        })
        .catch(error => {
            return error.response
        })
}

export function updateUser(id, userData) {
    return axios({
        method: 'put',
        url: domainName + id,
        data: userData
    })
        .then(response => {
            return response
        })
        .catch(error => {
            return error.response
        })
}

export function deleteUser(id) {
    console.log(id)
    return axios({
        method: 'delete',
        url: domainName + id
    })
        .then(response => {
            return console.log(response)
        })
        .catch(error => {
            return console.log(error.response)
        })
}