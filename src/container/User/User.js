import React from 'react';
import PropTypes from 'prop-types';
import {Http} from '../../classes';
import {Loading,UserHeader,ArticleList,ToolButton} from '../../components';
import * as styles from './User.scss';

const http = new Http();


export class User extends React.Component {

    static propTypes = {
        isSelf: PropTypes.bool.isRequired,
        history: PropTypes.object.isRequired
    };

    static defaultProps = {
        isSelf: false
    };

    constructor(props) {
        super(props);
        this.state = {
            dataLoaded: false,
            whichTag: 'recent_replies',
            itemDate: []
        };
        this.getUserInfo = this.getUserInfo.bind(this);
        this.getTabs = this.getTabs.bind(this);
        this.onClickTab = this.onClickTab.bind(this);
        this.onGoBack = this.onGoBack.bind(this);
    };

    componentDidMount() {
        this.getUserInfo();
    }

    getUserInfo() {
        const {match} = this.props;
        const {whichTag} = this.state;
        const name = match.params.username;
        http.get(`/user/${name}`).then((res) => {
            this.setState({
                data: res.data,
                itemDate: res.data[whichTag],
                dataLoaded: true
            });
        }).catch((err) => {
            console.log(err);
        })
    }


    getTabs() {
        const {whichTag} = this.state;
        const tabLists = [
            {
                tab: '最近回复',
                tag:'recent_replies',
                active: true
            },
            {
                tab: '最新发布',
                tag: 'recent_topics',
                active: true
            }
        ];

        return tabLists.map((tab)=>{
            return {
                ...tab,
                active: tab.tag === whichTag
            }
        });
    }

    onClickTab(item) {
        const {data} = this.state;
        this.setState({
            whichTag: item,
            itemDate: data[item]
        });
    }

    onGoBack() {
        window.history.go(-1);
    }

    render() {
        const {dataLoaded,data,itemDate} = this.state;
        const {history,isSelf} = this.props;
        const tabs = this.getTabs();
        if(dataLoaded) {
            return (
                <div className={styles.user}>
                    <UserHeader avatarUrl={data.avatar_url}
                                name={data.loginname}
                                createAt={data.create_at}
                                score={data.score}
                                isSelf={isSelf}
                                history={history}
                    />
                    <div className={styles.content}>
                        <div className={styles.tab}>
                            {
                                tabs.map((tab,i)=>{
                                    return (
                                        <div key={i} className={`${tab.active ? styles.active: '' } ${styles.tab_items}`}
                                            onClick={()=>{this.onClickTab(tab.tag)}}>
                                            {tab.tab}
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div>
                            <ArticleList datas={itemDate} history={history} type="name"/>
                        </div>
                    </div>
                    <ToolButton onButtonClick={this.onGoBack}/>
                </div>
            )
        }else {
            return (
                <Loading/>
            )
        }
    }

}
