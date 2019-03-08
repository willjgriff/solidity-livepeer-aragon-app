import React from 'react'
import { AragonApp, Button, Text, observe } from '@aragon/ui'
import styled from 'styled-components'
import LivepeerBalance from "./components/LivepeerTokenBalance"

const AppContainer = styled(AragonApp)`
  display: flex;
  align-items: center;
  justify-content: center;
`

export default class App extends React.Component {

    render() {
        return (
            <AppContainer>
                <div>
                    <ObservedCount observable={this.props.observable}/>
                    <Button onClick={() => this.props.app.decrement(1)}>Decrement</Button>
                    <Button onClick={() => this.props.app.increment(1)}>Increment</Button>
                    <LivepeerBalance observable={this.props.observable} />
                    <Button onClick={() => this.props}>Approve tokens for transfer</Button>
                </div>
            </AppContainer>
        )
    }
}

const ObservedCount = observe(
    (state$) => state$,
    {count: 0}
)(
    ({count}) => <Text.Block style={{textAlign: 'center'}} size='xxlarge'>{count}</Text.Block>
)
