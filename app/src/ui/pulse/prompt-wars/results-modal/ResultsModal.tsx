import clsx from "clsx";
import { useEffect, useState } from "react";

import { Modal } from "ui/modal/Modal";
import { Typography } from "ui/typography/Typography";
import { Grid } from "ui/grid/Grid";
import { Card } from "ui/card/Card";
import ipfs from "providers/ipfs";
import { OutcomeId } from "providers/near/contracts/prompt-wars/prompt-wars.types";
import { useNearPromptWarsMarketContractContext } from "context/near/prompt-wars-market-contract/useNearPromptWarsMarketContractContext";
import { Icon } from "ui/icon/Icon";

import styles from "./ResultsModal.module.scss";
import { ResultsModalOutcomeToken, ResultsModalProps } from "./ResultsModal.types";

export const ResultsModal: React.FC<ResultsModalProps> = ({ onClose, className, marketContractValues }) => {
  const [outcomeToken, setOutcomeToken] = useState<ResultsModalOutcomeToken | undefined>();
  const [winnerOutcomeToken, setWinnerOutcomeToken] = useState<ResultsModalOutcomeToken | undefined>();

  const contract = useNearPromptWarsMarketContractContext();

  const { resolution, market, outcomeIds } = marketContractValues;

  const getOutcomeToken = async (outcome_id: OutcomeId) => {
    const ot = await contract.getOutcomeToken({ outcome_id });

    if (!ot) {
      return;
    }

    setOutcomeToken({
      outcomeId: ot.outcome_id,
      outputImgUrl: ot.output_img_uri!,
      prompt: JSON.parse(ot.prompt).value,
      negativePrompt: JSON.parse(ot.prompt).negative_prompt,
      result: ot.result!,
    });
  };

  const getWinnerOutcomeToken = async () => {
    const ot = await contract.getOutcomeToken({ outcome_id: resolution.result! });

    if (!ot) {
      return;
    }

    setWinnerOutcomeToken({
      outcomeId: ot.outcome_id,
      outputImgUrl: ot.output_img_uri!,
      prompt: JSON.parse(ot.prompt).value,
      negativePrompt: JSON.parse(ot.prompt).negative_prompt,
      result: ot.result!,
    });
  };

  useEffect(() => {
    getWinnerOutcomeToken();
    getOutcomeToken(resolution.result!);
  }, []);

  return (
    <Modal
      className={clsx(styles["results-modal"], className)}
      isOpened
      aria-labelledby="Prompt Wars Reveal Progress Modal Window"
      onClose={onClose}
      fullscreenVariant="default"
    >
      <Modal.Header onClose={onClose}>
        <Typography.Headline2 flat>Results</Typography.Headline2>
        <Typography.Text flat>
          Winner: {resolution?.result}, {winnerOutcomeToken?.result}
        </Typography.Text>
      </Modal.Header>
      <Modal.Content>
        <Grid.Row>
          <Grid.Col lg={4} className={styles["results-modal__img-col"]}>
            <Card>
              <Card.Content className={styles["results-modal__img-col--content"]}>
                <img src={ipfs.asHttpsURL(market.image_uri)} alt="source" />
              </Card.Content>
            </Card>
          </Grid.Col>
          <Grid.Col lg={4} className={styles["results-modal__img-col"]}>
            <Card>
              <Card.Content className={styles["results-modal__img-col--content"]}>
                <div className={styles["results-modal__outcome-ids-list"]}>
                  {outcomeIds.map((outcomeId) => (
                    <div
                      key={outcomeId}
                      className={styles["results-modal__outcome-ids-list--item"]}
                      onClick={() => getOutcomeToken(outcomeId)}
                      onKeyPress={() => undefined}
                      role="button"
                      tabIndex={0}
                    >
                      <Grid.Row>
                        <Grid.Col className={styles["results-modal__outcome-ids-list--item-left"]}>
                          <Typography.Description
                            flat
                            className={clsx({
                              [styles["results-modal__outcome-ids-list--item-winner"]]: outcomeId === resolution.result,
                            })}
                          >
                            {outcomeId}
                          </Typography.Description>
                        </Grid.Col>
                        <Grid.Col className={styles["results-modal__outcome-ids-list--item-right"]}>
                          <Icon name="icon-chevron-right" />
                        </Grid.Col>
                      </Grid.Row>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </Grid.Col>
          <Grid.Col lg={4} className={styles["results-modal__img-col"]}>
            <Card>
              <Card.Content className={styles["results-modal__img-col--content"]}>
                <img src={outcomeToken?.outputImgUrl || "/shared/loading-spinner.gif"} alt="output" />
              </Card.Content>
            </Card>
          </Grid.Col>
        </Grid.Row>
      </Modal.Content>
      <Modal.Actions className={styles["results-modal__modal-actions"]}>
        <Grid.Row className={styles["results-modal__modal-actions--row"]}>
          <Grid.Col lg={3}>
            <Typography.Description>Account</Typography.Description>
            <Typography.Text className={styles["results-modal__modal-actions--text"]}>
              {outcomeToken?.outcomeId || "Loading"}
            </Typography.Text>
          </Grid.Col>
          <Grid.Col lg={3}>
            <Typography.Description>Prompt</Typography.Description>
            <Typography.Text className={styles["results-modal__modal-actions--text"]}>
              {outcomeToken?.prompt || "Loading"}
            </Typography.Text>
          </Grid.Col>
          <Grid.Col lg={3}>
            <Typography.Description>Negative Prompt</Typography.Description>
            <Typography.Text className={styles["results-modal__modal-actions--text"]}>
              {outcomeToken?.negativePrompt || "Loading"}
            </Typography.Text>
          </Grid.Col>
          <Grid.Col lg={3}>
            <Typography.Description>Result</Typography.Description>
            <Typography.Headline2 flat>{outcomeToken?.result || "Loading"}</Typography.Headline2>
          </Grid.Col>
        </Grid.Row>
      </Modal.Actions>
    </Modal>
  );
};
