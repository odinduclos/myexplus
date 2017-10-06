<?php

namespace AppBundle\Entity;

/**
 * StagesMaitresDeStage
 */
class StagesMaitresDeStage
{
    /**
     * @var integer
     */
    private $id;

    /**
     * @var \AppBundle\Entity\Stages
     */
    private $idStage;

    /**
     * @var \AppBundle\Entity\MaitresDeStage
     */
    private $idMaitreDeStage;


    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set idStage
     *
     * @param \AppBundle\Entity\Stages $idStage
     *
     * @return StagesMaitresDeStage
     */
    public function setIdStage(\AppBundle\Entity\Stages $idStage = null)
    {
        $this->idStage = $idStage;

        return $this;
    }

    /**
     * Get idStage
     *
     * @return \AppBundle\Entity\Stages
     */
    public function getIdStage()
    {
        return $this->idStage;
    }

    /**
     * Set idMaitreDeStage
     *
     * @param \AppBundle\Entity\MaitresDeStage $idMaitreDeStage
     *
     * @return StagesMaitresDeStage
     */
    public function setIdMaitreDeStage(\AppBundle\Entity\MaitresDeStage $idMaitreDeStage = null)
    {
        $this->idMaitreDeStage = $idMaitreDeStage;

        return $this;
    }

    /**
     * Get idMaitreDeStage
     *
     * @return \AppBundle\Entity\MaitresDeStage
     */
    public function getIdMaitreDeStage()
    {
        return $this->idMaitreDeStage;
    }
}
