<?php

namespace AppBundle\Entity;

/**
 * StagesStagiaires
 */
class StagesStagiaires
{
    /**
     * @var \AppBundle\Entity\Stages
     */
    private $idStage;

    /**
     * @var \AppBundle\Entity\Stagiaires
     */
    private $idStagiaire;


    /**
     * Set idStage
     *
     * @param \AppBundle\Entity\Stages $idStage
     *
     * @return StagesStagiaires
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
     * Set idStagiaire
     *
     * @param \AppBundle\Entity\Stagiaires $idStagiaire
     *
     * @return StagesStagiaires
     */
    public function setIdStagiaire(\AppBundle\Entity\Stagiaires $idStagiaire = null)
    {
        $this->idStagiaire = $idStagiaire;

        return $this;
    }

    /**
     * Get idStagiaire
     *
     * @return \AppBundle\Entity\Stagiaires
     */
    public function getIdStagiaire()
    {
        return $this->idStagiaire;
    }
    /**
     * @var integer
     */
    private $id;


    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }
}
