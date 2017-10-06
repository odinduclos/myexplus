<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use FOS\RestBundle\Controller\Annotations as Rest;
use AppBundle\Form\StagesType;
use AppBundle\Entity\Stages;
use AppBundle\Entity\StagesMaitresDeStage;
use AppBundle\Entity\MaitresDeStage;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Stagesmaitresdestage controller.
 *
 */
class StagesMaitresDeStageController extends Controller
{
    /**
     * Lists all stagesMaitresDeStage entities.
     *
     * @Rest\View()
     * @Rest\Get("/stagesmaitresdestages")
     * @Security("has_role(2) || has_role(3)")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $stagesmaitresdestages = $em->getRepository('AppBundle:StagesMaitresDeStage')->findAll();

        return $stagesmaitresdestages;
    }

     /**
     * Finds and displays a maitre de stage entity.
     *
     * @Rest\View()
     * @Rest\Get("/mystagesmaitredestage/{id}")
     * @Security("has_role(2) || has_role(3) || has_role(1)")
     */
    public function mystagesmaitredestage($id) {
        $em = $this->getDoctrine()->getManager();
        $stages = $em->getRepository('AppBundle:StagesMaitresDeStage')->findByIdMaitreDeStage($id);

        return $stages;
    }

    /**
     * Creates a new stagesMaitresDeStage entity.
     *
     * @Rest\View(statusCode=Response::HTTP_CREATED)
     * @Rest\Post("/stagesmaitresdestage/new")
     * @Security("has_role(2) || has_role(3)")
     */
    public function newAction(Request $request)
    {
        $stagesmaitresdestage = new Stagesmaitresdestage();
        $em = $this->getDoctrine()->getManager();
        $stage = $em->getRepository('AppBundle:Stages')->find($request->get('idStage'));
        $maitredestage = $em->getRepository('AppBundle:MaitresDeStage')->find($request->get('idMaitreDeStage'));

        $stagesmaitresdestage->setIdStage($stage)
        ->setIdMaitreDeStage($maitredestage);

        if ($stagesmaitresdestage->getIdStage() == null || $stagesmaitresdestage->getIdMaitreDeStage() == null) {
            return new JsonResponse(["message_err" => "Tous les champs ne sont pas remplis !"]);
        }

        $em = $this->get('doctrine.orm.entity_manager');
        $em->persist($stagesmaitresdestage);
        $em->flush();

        return $stagesmaitresdestage;
    }

    /**
     * Finds and displays a stagesMaitresDeStage entity.
     *
     * @Rest\View()
     * @Rest\Get("/stagesmaitresdestage/{id}")
     * @Security("has_role(2) || has_role(3)")
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $stagesmaitresdestage = $em->getRepository('AppBundle:StagesMaitresDeStage')->find($id);

        return $stagesmaitresdestage;
    }

    /**
     * Displays a form to edit an existing competence entity.
     *
     * @Rest\View()
     * @Rest\Patch("/stagesmaitresdestage/{id}")
     * @Security("has_role(2) || has_role(3)")
     */
    public function patchStagesMaitresDeStageAction(Request $request)
    {
        return $this->updateStagesMaitresDeStage($request);
    }

    public function updateStagesMaitresDeStage(Request $request)
    {
        $stagesmaitresdestage = $this->get('doctrine.orm.entity_manager')
        ->getRepository('AppBundle:StagesMaitresDeStage')
        ->find($request->get('id'));

        if (empty($stagesmaitresdestage)) {
            return new JsonResponse(['message_err' => "Le stage du maitre de stage est introuvable !"], Response::HTTP_NOT_FOUND);
        }

        $form = $this->createForm(CompetencesType::class, $stagesmaitresdestage);
        $form->submit($request->request->all(), false);

        if ($form->isValid()) {
            $em = $this->get('doctrine.orm.entity_manager');
            $em->persist($stagesmaitresdestage);
            $em->flush();
            return $stagesmaitresdestage;
        } else {
            return $form;
        }
    }

    /**
     * Deletes a competence entity.
     *
     * @Rest\View(statusCode=Response::HTTP_NO_CONTENT)
     * @Rest\Delete("/stagesmaitresdestage/{id}")
     * @Security("has_role(2) || has_role(3)")
     */
    public function deleteAction(Request $request)
    {
        $em = $this->get('doctrine.orm.entity_manager');
        $stagesmaitresdestage = $em->getRepository('AppBundle:StagesMaitresDeStage')
        ->find($request->get('id'));

        if ($stagesmaitresdestage) {
            $em->remove($stagesmaitresdestage);
            $em->flush();
            return new JsonResponse(["message" => "Le stage du maitre de stage a bien été supprimé !"]);
        }
        else
            return new JsonResponse(["message_err" => "Le stage du maitre de stage est introuvable !"]);
    }
}
