import React, { Component } from 'react'
import { connect } from '../../utils/performance'
import { filterActive } from '../../redux/data-utils'
import { Container, ContainerHeaderWithIcon, ContainerBodyWithPadding } from '../../components/Container'
import { FormInput, FormInputEmail, FormInputFullName } from '../../components/FormInput'
import { IconUser } from '../../components/Icon'
import { FormButton } from '../../components/FormButton'
import { updateCurrentUser } from '../../redux/actions/users'
import { ProfilePicture } from './ProfilePicture'
import { ProfileChangePassword } from './ProfileChangePassword'
import { namespace } from '../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.profile')

const mapStateToProps = ({ users, currentUser }) => {
  return {
    email: currentUser.email,
    fullName: currentUser.fullName,
    picture: currentUser.picture,
    title: currentUser.title,
    existingEmails: filterActive(users).map((u) => u.email).toArray()
  }
}

class Profile extends Component {
  componentWillMount () {
    this.resetState()
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.setState({ isLoading: true })
    this.props.dispatch(updateCurrentUser(this.attrs)).then(() => {
      this.resetState()
      this.refs.password.resetState()
    })
  }

  createChangeHandler (prop) {
    return ({ isValid, isChanged, value }) => {
      if (isChanged && isValid) {
        this.attrs[prop] = value
      } else {
        delete this.attrs[prop]
      }
      this.setState({ isDisabled: !Object.keys(this.attrs).length })
    }
  }

  resetState () {
    this.attrs = {}
    this.setState({ isDisabled: true, isLoading: false })
  }

  render () {
    const { isDisabled, isLoading } = this.state
    const { picture, email, fullName, title, existingEmails } = this.props
    return (
      <Container>
        <ContainerHeaderWithIcon text={tn('header-title')} icon={<IconUser />} />
        <ContainerBodyWithPadding>
          <form onSubmit={this.onSubmit}>
            <ProfilePicture picture={picture} onChange={this.createChangeHandler('imageSrc')} />
            <div className="bf-ProfileColumns">
              <div className="bf-ProfileColumns-column">
                <FormInputEmail
                  defaultValue={email}
                  isRequired
                  onChange={this.createChangeHandler('email')}
                  existingEmails={existingEmails}
                />
                <FormInputFullName
                  defaultValue={fullName}
                  isRequired
                  onChange={this.createChangeHandler('fullName')}
                />
                <FormInput
                  label={tn('title')}
                  placeholder={tn('title-example')}
                  defaultValue={title}
                  onChange={this.createChangeHandler('title')}
                />
              </div>
              <div className="bf-ProfileColumns-column">
                <ProfileChangePassword ref="password" onChange={this.createChangeHandler('password')} />
              </div>
            </div>
            <FormButton
              text={tn('update-info')}
              icon={<IconUser />}
              isDisabled={isDisabled}
              isLoading={isLoading}
              onClick={this.onSubmit}
            />
          </form>
        </ContainerBodyWithPadding>
      </Container>
    )
  }
}

export default connect(mapStateToProps)(Profile)
