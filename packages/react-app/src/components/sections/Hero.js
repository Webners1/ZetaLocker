import React, {useState} from 'react';
import classNames from 'classnames';
import {SectionProps} from '../../utils/SectionProps';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';
import {useQuery} from "@apollo/react-hooks";
import GET_TRANSFERS from "../../graphql/subgraph";
import useWeb3Modal from '../../hooks/useWeb3Modal';
import Modal from "../elements/Modal";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import ReactGA from 'react-ga';

const propTypes = {
  ...SectionProps.types
}

const defaultProps = {
  ...SectionProps.defaults
}

function Hero(
  {
    className,
    topOuterDivider,
    bottomOuterDivider,
    topDivider,
    bottomDivider,
    hasBgColor,
    invertColor,
    ...props
  }) {

  const {loading, error, data} = useQuery(GET_TRANSFERS);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [depositModalActive, setDepositModalActive] = useState(false);
  const [withdrawModalActive, setWithdrawModalActive] = useState(false);

  const openDepositModal = (e) => {
    if (provider != null) {
      e.preventDefault();
      setDepositModalActive(true);
      ReactGA.event({
        category: 'User',
        action: 'Open Deposit Modal'
      });
    } else {
      loadWeb3Modal().then(() => setDepositModalActive(true))
    }
  }

  const openWithdrawModal = (e) => {
    if (provider != null) {
      e.preventDefault();
      setWithdrawModalActive(true);
      ReactGA.event({
        category: 'User',
        action: 'Open Withdraw Modal'
      });
    } else {
      loadWeb3Modal().then(() => setWithdrawModalActive(true))
    }
  }

  const closeModal = (e) => {
    e.preventDefault();
    setDepositModalActive(false);
    setWithdrawModalActive(false);
  }

  const outerClasses = classNames(
    'hero section center-content',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'hero-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  React.useEffect(() => {
    if (!loading && !error && data && data.transfers) {
      console.log({transfers: data.transfers});
    }
  }, [loading, error, data]);

  function WalletButton({provider, loadWeb3Modal, logoutOfWeb3Modal}) {
    return (
      <Button
        onClick={() => {
          if (!provider) {
            loadWeb3Modal();
          } else {
            logoutOfWeb3Modal();
          }
        }}
      >
        {!provider ? "Connect Wallet" : "Disconnect Wallet"}
      </Button>
    );
  }

  return (
    <section
      {...props}
      className={outerClasses}>
      <div className="container-sm">
        <div className={innerClasses}>
          <div className="hero-content">
            <h1 className="mt-0 mb-16 reveal-from-bottom" data-reveal-delay="200">
              Ace <span className="text-color-primary">Locker</span>
            </h1>
            <div className="container-xs">
              <p className="m-0 mb-32 reveal-from-bottom" data-reveal-delay="400">
                Safely keep your tokens locked for a time period of your own choosing.
                <br/>
                <br/>
                Prevents you from making
                bad decisions and selling too early.
                <br/>
                It's free to use if you respect the unlock date for withdrawal that
                you have chosen.
                <br/>
                <br/>
                There is a penalty fee that you pick on deposit to protect yourself from trying to withdraw before the
                unlock date.
              </p>
              <div className="reveal-from-bottom" data-reveal-delay="600">

                <ButtonGroup>
                  <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal}
                                logoutOfWeb3Modal={logoutOfWeb3Modal}/>
                </ButtonGroup>

                <ButtonGroup>
                  <Button color="primary" wideMobile aria-controls="video-modal"
                          onClick={openDepositModal}>
                    Lock
                  </Button>
                  <Button color="dark" wideMobile onClick={openWithdrawModal}>
                    Withdraw Lock
                  </Button>
                </ButtonGroup>
              </div>
              <Modal
                id="deposit-modal"
                show={depositModalActive}
                handleClose={closeModal}>
                <Deposit provider={provider}/>
              </Modal>
              <Modal
                id="withdraw-modal"
                show={withdrawModalActive}
                handleClose={closeModal}>
                <Withdraw provider={provider}/>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;
