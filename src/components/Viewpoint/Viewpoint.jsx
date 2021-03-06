import React, { Component } from 'react';
import by from 'sort-by';
import Topic from '../Topic/Topic.jsx';
import Hypertopic from 'hypertopic';
import conf from '../../config/config.json';
const db = new Hypertopic(conf.services);
class Viewpoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleted: false
    }
  }

  render() {
    if (this.state.deleted) return null;
    let topics = this._getTopics();
    let outliner = this._getOutliner();
    return (
      <div className="DescriptionModality">
        <h3>
          {this.props.viewpoint.name}
          <a className='outliner' href={outliner}>
            ✏️
          </a>
          {
            this._isReserved() ? null :
              <a className='ViewpointDeletor' onClick={this._onDeleteHandler.bind(this)}>
                ❌
              </a>
          }
        </h3>
        <div className="Topics">
          <ul>
            {topics}
          </ul>
        </div>
      </div>
    );
  }

  _getTopics() {
    return (this.props.viewpoint.upper || []).sort(by('name')).map((t) =>
      <Topic key={t.id} id={t.id} name={t.name} topics={this.props.viewpoint}
        selection={this.props.selection} topicsItems={this.props.topicsItems} />
    );
  }

  _getOutliner() {
    let uri = '/viewpoint/' + this.props.viewpoint.id;
    return uri;
  }

  _isReserved() {
    let viewpointName = this.props.viewpoint.name;
    if (Array.isArray(this.props.viewpoint.name)) viewpointName = this.props.viewpoint.name[0];
    return conf.reservedViewpoints.indexOf(viewpointName) >= 0;
  }

  _onDeleteHandler() {
    if (window.confirm("Est-ce que vous voulez réellement supprimer ce point de vue?")) {
      db.get({ _id: this.props.viewpoint.id })
        .then(db.delete)
        .then(_ => this.setState({ deleted: true }))
        .catch(err => {
          console.error(err);
          window.alert("Erreur lors de la suppression");
        });
    }
  }
}

export default Viewpoint;
