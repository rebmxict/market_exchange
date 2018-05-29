import React, { Component } from 'react';
import Avatar from 'react-avatar-edit';
import Loading from '../functions/Loading';
import axios from 'axios';
import { API_SERVER } from '../../constants';

export default class Profile extends Component {
    constructor(props) {
        super(props);

        const src = '/img/blank_avatar.png';

        this.state = {
            isAvatarClicked: 0,
            preview: null,
            src: src,
            loaded: true,
            nameediting: false,
            summaryediting: false,
            profile: {}
        };

        this.onCrop = this.onCrop.bind(this);
        this.onClose = this.onClose.bind(this);
        this.handleAvatarClick = this.handleAvatarClick.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.getProfile = this.getProfile.bind(this);
    }

    onClose() {
        this.setState({preview: null});
    }

    onCrop(preview) {
        this.setState({preview});
    }

    handleAvatarClick(val) {
        this.setState({
            isAvatarClicked: val
        });
    }

    handleEdit(type) {
        if(type == "name") {
            this.setState({
                nameediting: !this.state.nameediting
            });        
        } else if(type == "summary") {
            this.setState({
                summaryediting: !this.state.summaryediting
            });
        }
    }

    handleNameChange(val, type) {
        let tstate = this.state;
        if(type == 1)
            tstate.profile["first_name"] = val;
        else if(type == 2)
            tstate.profile["last_name"] = val;
        this.setState(tstate);
    }

    handleSummaryChange(val) {
        let tstate = this.state;
        tstate.profile["summary"] = val;
        this.setState(tstate);
    }

    getProfile() {
        this.setState({loaded: false});
        axios.get(API_SERVER + '/api/v1/get/profile')
            .then((data) => {
                let results = data.data;
                this.setState({
                    profile: results,
                    loaded: true
                });
                if(results.avatar)
                    this.setState({preview: results.avatar});
            })
            .catch(err => console.log(err));
    }

    handleSave() {
        this.setState({loaded: false});
        let playload = {
            avatar: this.state.preview,
            first_name: this.state.profile.first_name,
            last_name: this.state.profile.last_name,
            summary: this.state.profile.summary
        };
        axios.post(API_SERVER + '/api/v1/save/profile', playload)
            .then((data) => {
                let results = data.data;
                this.setState({
                    loaded: true
                });
            })
            .catch(err => console.log(err)); 
    }

    componentDidMount() {
        this.getProfile();
    }

	render() {
		return(
            <div className="row profilepage" id="main" >
                <div className="row profilepagediv">
                    <div className="col-width contentdiv">
                        <div className="profilediv">
                            <div className="card-header">Profile Details</div>
                            <div className={this.state.isAvatarClicked == 0 ? "avatar_cover2" : "avatar_cover1"}>
                                <div id="avatar_uploader" className="avatar_uploader">
                                    <Avatar
                                        width={390}
                                        height={295}
                                        onCrop={this.onCrop}
                                        onClose={this.onClose}
                                        src={this.state.src}
                                    />
                                </div>
                                <div className="avatar_prev">
                                    <h4>Preview</h4>
                                    <img src={this.state.preview} alt="Preview" width="150" height="150" />
                                    <div className="overlay" onClick={() => this.handleAvatarClick(1)}>
                                        <div className="text">Change Avatar</div>
                                    </div>
                                    <button className="avatar_save" onClick={() => this.handleAvatarClick(0)}>Set</button>
                                </div>
                                <div className="personal_info">
                                    <div>
                                        <input 
                                            className={this.state.nameediting ? "profileinput active" : "profileinput"}
                                            type="text" 
                                            value={this.state.profile.first_name}
                                            onChange={(e) => this.handleNameChange(e.target.value, 1)}
                                        />
                                        <input 
                                            className={this.state.nameediting ? "profileinput active" : "profileinput"}
                                            type="text" 
                                            value={this.state.profile.last_name}
                                            onChange={(e) => this.handleNameChange(e.target.value, 2)}
                                        />
                                        <i className="profileedit material-icons" 
                                            onClick={() => this.handleEdit("name")}>
                                            {this.state.nameediting ? "done" : "mode_edit"}
                                        </i>
                                    </div>
                                    <label className="profileemail">
                                        {this.state.profile.email}
                                        <i className="material-icons">check_circle</i>
                                    </label><br />
                                </div>
                            </div>
                            <div className="othercontact">
                                <div className="summarydiv">
                                    <h6>Summary</h6>
                                    <i className="profileedit material-icons" 
                                        onClick={() => this.handleEdit("summary")}>
                                        {this.state.summaryediting ? "done" : "mode_edit"}
                                    </i>
                                </div>
                                <textarea 
                                    className={this.state.summaryediting ? "summaryinput active" : "summaryinput"}
                                    type="text" 
                                    value={this.state.profile.summary}
                                    onChange={(e) => this.handleSummaryChange(e.target.value)}
                                />
                            </div>
                            <button className="btn btn-primary customized_btn" onClick={() => this.getProfile()}>Reset</button>
                            <button className="btn btn-success customized_btn" onClick={() => this.handleSave()}>Save</button>
                        </div>
                    </div>
                    <div className="col-width contentdiv">
                        <div className="profilediv">
                            <div className="card-header">KYC Verification</div>
                        </div>
                    </div>
                </div>
                <Loading loaded={this.state.loaded} />
            </div>
		);
	}
}