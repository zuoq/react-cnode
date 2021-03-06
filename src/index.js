import React from 'react';
import '../public/css/markdown.css';
import ReactDom from 'react-dom';
import './vendors';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import {App,Article,User,Comment,Publish,Message} from './container';


// console.log(process.env.NODE_ENV);
global.__DEVELOPMENT__ = process.env.NODE_ENV === 'development';
const vDomTree = (
    <Router>
        <Switch>
            <Route exact path="/" component={App} />
            <Route exact path="/home" component={App} />
            <Route exact path="/good" component={App} />
            <Route exact path="/ask" component={App} />
            <Route exact path="/share" component={App} />
            <Route exact path="/job" component={App} />
            <Route exact path="/topic/:id"  component={Article}/>
            <Route exact path="/user/:username"  component={User}/>
            <Route exact path="/owner/:username"  component={({match,history})=>(
                <User isSelf={true} match={match} history={history} />
            )}/>
            <Route exact path="/comment/:topic_id"  component={Comment}/>
            <Route exact path="/comment/:topic_id/:reply_id"  component={({match,history})=>(
                <Comment isReply={true} match={match} history={history}/>
            )}/>
            <Route exact path="/publish"  component={Publish}/>
            <Route exact path="/message"  component={Message}/>
        </Switch>
    </Router>

);

document.addEventListener('DOMContentLoaded',function() {
    const container = document.getElementById('app');
    if(container) {
        ReactDom.render(vDomTree,container);
    }else {
        console.warn('cannot find the container');
    }
});

