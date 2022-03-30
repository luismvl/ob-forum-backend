/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import { BaseModel } from '@ioc:Adonis/Lucid/Orm'
import { CamelCaseNamingStrategy } from 'Contracts/CamelCaseNamingStrategy '
BaseModel.namingStrategy = new CamelCaseNamingStrategy()