import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import Details from '../pages/details';
import Success from '../pages/success';
import Modify from '../pages/modify';
import LogisticsList from '../pages/logisticsList';

const BasicRoute = () => (
    <HashRouter>
        <Switch>
            <Route exact path="/details" component={Details}/>
            <Route exact path="/" component={Details}/>
            <Route exact path="/success" component={Success}/>
            <Route exact path="/modify" component={Modify}/>
            <Route exact path="/logisticsList" component={LogisticsList}/>
        </Switch>
    </HashRouter>
);


export default BasicRoute;