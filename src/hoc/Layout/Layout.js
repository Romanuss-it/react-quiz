import React, { Component } from "react"
import classes from "./Layout.css"
import MenuToggle from "../../components/Navigation/MenuToggle/MenuToggle"
import Drawer from "../../components/Navigation/Drawer/Drawer"
import { connect } from "react-redux"

class Layout extends Component {
  state = {
    menu: false,
  }

  toggleMenuHandler = () => {
    this.setState({
      menu: !this.state.menu,
    })
  }

  menuCloseHandler = () => {
    this.setState({
      menu: false,
    })
  }

  render() {
    return (
      <div className={classes.Layout}>
        <Drawer
          isAuthenticated={this.props.isAuthenticated}
          isOpen={this.state.menu}
          onClose={this.menuCloseHandler}
        />
        <MenuToggle
          onToggle={this.toggleMenuHandler}
          isOpen={this.state.menu}
        />

        <main>{this.props.children}</main>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: !!state.auth.token,
  }
}

export default connect(mapStateToProps, null)(Layout)
